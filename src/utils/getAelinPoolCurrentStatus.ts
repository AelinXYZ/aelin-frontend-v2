import { BigNumber } from '@ethersproject/bignumber'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'

import { MAX_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { formatToken } from '@/src/web3/bigNumber'

export enum AelinPoolState {
  PoolInfo = 'Pool Info',
  WaitingForDeal = 'Waiting Deal',
  Vesting = 'Vesting',
  Closed = 'Closed',
}

interface BaseState {
  state: AelinPoolState
  prevStates: AelinPoolState[]
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

export interface WaitingForDealState extends BaseState {
  state: AelinPoolState
  meta: {
    dealPresented: boolean
  }
}

export type PoolState = FundingState | WaitingForDealState | undefined

export function isFunding(pool: BaseState): pool is FundingState {
  return pool.state === AelinPoolState.PoolInfo
}

function getFundingState(pool: ParsedAelinPool): FundingState {
  const isCap = pool.poolCap.raw.eq(0)
  const capAmount = pool.poolCap.raw
  const funded = pool.investmentRaisedAmount.raw
  const maxDepositAllowed = capAmount.sub(funded)
  return {
    state: AelinPoolState.PoolInfo,
    prevStates: [],
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
    prevStates: [AelinPoolState.PoolInfo],
    meta: {
      dealPresented: pool.dealAddress !== null,
    },
  }
}

function getPoolInfoAndDealInfoState(pool: ParsedAelinPool): WaitingForDealState {
  return {
    state: AelinPoolState.WaitingForDeal,
    prevStates: [AelinPoolState.PoolInfo],
    meta: {
      dealPresented: pool.dealAddress !== null,
    },
  }
}

export function getAelinPoolCurrentStatus(pool: ParsedAelinPool): PoolState {
  const now = Date.now()
  console.log(pool)
  // Funding
  if (isBefore(now, pool.purchaseExpiry)) {
    return getFundingState(pool)
  }
  // waiting for deal
  // if (isAfter(now, pool.purchaseExpiry) && isBefore(now, pool.dealDeadline)) {
  return getWaitingForDealState(pool)
  // }

  // WaitingForDeal
  //   if (isBefore(now, pool.dealDeadline)) {
  //     return State.WaitingForDeal
  //   }

  // TODO: others, for example
  // if dealDeadline and no Deal presented
  // return State.Closed
}
