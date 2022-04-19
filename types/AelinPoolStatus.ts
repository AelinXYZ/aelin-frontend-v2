import { BigNumber } from '@ethersproject/bignumber'

export enum AelinPoolState {
  Funding = 'Funding',
  WaitingForDeal = 'Waiting Deal',
  ProRata = 'Pro Rata',
  Vesting = 'Vesting',
  Closed = 'Closed',
}

interface BaseState {
  state: AelinPoolState
  prevStates: AelinPoolState[]
  meta: Record<string, unknown>
}

export interface FundingState extends BaseState {
  meta: {
    isCap: boolean
    capReached: boolean
    userAllowance: BigNumber
    refetchAllowance: () => void
    maxDepositAllowed: {
      raw: BigNumber
      formatted: string | undefined
    }
  }
}

export interface WaitingForDealState extends BaseState {
  meta: {
    isUserSponsor: boolean
    isDealPresent: boolean
    showCreateDealForm: boolean
  }
}

export type ProRataState = BaseState

export type PoolStatus = FundingState | WaitingForDealState | ProRataState

export function isFunding(pool: BaseState): pool is FundingState {
  return pool.state === AelinPoolState.Funding
}

export function isWaitingForDeal(pool: BaseState): pool is WaitingForDealState {
  return pool.state === AelinPoolState.WaitingForDeal
}

export function isProRata(pool: BaseState): pool is ProRataState {
  return pool.state === AelinPoolState.ProRata
}
