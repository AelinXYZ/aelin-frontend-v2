import { BigNumber } from '@ethersproject/bignumber'
import isBefore from 'date-fns/isBefore'

import { MAX_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { formatToken } from '@/src/web3/bigNumber'

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
    isCap: boolean
    capReached: boolean
    maxDepositAllowed: {
      raw: BigNumber
      formatted: string | undefined
    }
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
  const isCap = pool.poolCap.raw.eq(0)
  const capAmount = pool.poolCap.raw
  const funded = pool.funded.raw
  const maxDepositAllowed = capAmount.sub(funded)
  return {
    state: AelinPoolState.Funding,
    meta: {
      isCap,
      capReached: isCap ? false : capAmount.eq(funded),
      maxDepositAllowed: {
        raw: isCap ? MAX_BN : maxDepositAllowed,
        formatted: formatToken(maxDepositAllowed, pool.investmentTokenDecimals),
      },
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
