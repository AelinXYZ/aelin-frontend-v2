import { BigNumber } from '@ethersproject/bignumber'

import { PoolTimelineState } from '@/src/constants/types'
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
  WaitingForHolder = 'Waiting For Holder',
  Vesting = 'Vesting',
  Closed = 'Closed',
}

export enum PoolTab {
  PoolInformation = 'Pool Information',
  DealInformation = 'Deal Information',
  WithdrawUnredeemed = 'Withdraw Unredeemed',
  Vest = 'Vest',
}

export enum PoolAction {
  Invest = 'Deposit tokens',
  ReleaseFunds = 'Release funds',
  CreateDeal = 'Create Deal',
  AwaitingForDeal = 'Awaiting for Deal',
  FundDeal = 'Fund Deal',
  AcceptDeal = 'Accept Deal',
  Withdraw = 'Withdraw',
  Claim = 'Claim',
  WithdrawUnredeemed = 'Withdraw Unredeemed',
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
  refetchUserAllowance: () => void
  maxDepositAllowed: DetailedNumber
  poolTokenBalance: DetailedNumber
  userInvestmentTokenBalance: DetailedNumber
  refetchUserInvestmentTokenBalance: () => void
}

export interface WaitingForDeal {
  userTotalWithdrawn: DetailedNumber
  userMaxAllocation: DetailedNumber
  refetchUserStats: () => void
}

export type TimelineSteps = {
  [key in PoolTimelineState as number]?: {
    active: boolean
    isDone: boolean
    value?: string
    deadline?: string
    deadlineProgress?: string
    isDefined?: boolean
  }
}

export type DerivedStatus = {
  current: PoolStatus
  history: PoolStatus[]
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
