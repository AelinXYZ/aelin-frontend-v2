import isBefore from 'date-fns/isBefore'

import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'

export enum AelinPoolState {
  Funding = 'Funding',
  WaitingForDeal = 'WaitingForDeal',
  Vesting = 'Vesting',
  Closed = 'Closed',
}

interface BaseState {
  state: AelinPoolState
  meta: Record<string, unknown>
}

export interface FundingState extends BaseState {
  state: AelinPoolState
  meta: {
    capReached: boolean
  }
}

export function isFunding(pool: BaseState): pool is FundingState {
  return pool.state === AelinPoolState.Funding
}

interface WaitingForDealState extends BaseState {
  state: AelinPoolState
  meta: {
    dealPresented: boolean
  }
}

function getFundingState(pool: ParsedAelinPool): FundingState {
  return {
    state: AelinPoolState.Funding,
    meta: {
      capReached: pool.poolCap.raw.eq(0) ? false : pool.poolCap.raw.eq(pool.funded.raw),
    },
  }
}

function getWaitingForDealState(pool: ParsedAelinPool): WaitingForDealState {
  return {
    state: AelinPoolState.WaitingForDeal,
    meta: {
      dealPresented: pool.dealAddress !== null,
    },
  }
}

export type PoolState = FundingState | WaitingForDealState
export function getAelinPoolCurrentStatus(pool: ParsedAelinPool): PoolState {
  // Funding
  const now = Date.now()
  if (isBefore(now, pool.purchaseExpiry)) {
    return getFundingState(pool)
  }

  return getWaitingForDealState(pool)

  // WaitingForDeal
  //   if (isBefore(now, pool.dealDeadline)) {
  //     return State.WaitingForDeal
  //   }

  // TODO: others, for example
  // if dealDeadline and no Deal presented
  // return State.Closed
}
