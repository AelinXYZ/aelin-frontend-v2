import { BigNumber } from '@ethersproject/bignumber'

import { DetailedNumber } from '@/types/utils'

export enum UserRole {
  Visitor,
  Investor,
  Sponsor,
  Holder,
}

export enum PoolStatus {
  Funding = 'Funding',
  SeekingDeal = 'Seeking Deal',
  DealPresented = 'Deal presented',
  Vesting = 'Vesting',
  Closed = 'Closed',
}

export enum PoolAction {
  Invest,
  CreateDeal,
  FundDeal,
  AcceptDeal,
  Withdraw,
  Claim,
}

// interface BaseState {
//   state: PoolState
//   prevStates: PoolState[]
//   meta: Record<string, unknown>
// }

export interface Funding {
  isCap: boolean
  capReached: boolean
  userAllowance: BigNumber
  refetchAllowance: () => void
  maxDepositAllowed: DetailedNumber
}

export interface WaitingForDeal {
  userTotalWithdrawn: DetailedNumber
  userProRataAllocation: DetailedNumber
}

export type ProRata = Record<string, unknown>

export type PoolStatusInfo = Funding | WaitingForDeal | ProRata

// export function isFunding(pool: BaseState): pool is FundingState {
//   return pool.state === AelinPoolState.Funding
// }

// export function isWaitingForDeal(pool: BaseState): pool is WaitingForDealState {
//   return pool.state === AelinPoolState.WaitingForDeal
// }

// export function isProRata(pool: BaseState): pool is ProRataState {
//   return pool.state === AelinPoolState.ProRata
// }
