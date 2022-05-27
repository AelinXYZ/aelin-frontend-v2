// 20 pool results by chain
import { PoolStatus } from '@/graphql-schema'

export const POOLS_RESULTS_PER_CHAIN = 20
export const VESTING_DEALS_RESULTS_PER_CHAIN = 20
export const NOTIFICATIONS_RESULTS_PER_CHAIN = 20
export const NOTIFICATIONS_BADGE_MAX = 9
export const USERS_RESULTS_PER_CHAIN = 20
export const HISTORY_RESULTS_PER_CHAIN = 20

export const MAX_ALLOWED_DEALS = 5

export enum Privacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum PoolStages {
  Open = 'Open',
  AwaitingDeal = 'AwaitingDeal',
  DealReady = 'DealReady',
  Vesting = 'Vesting',
  Complete = 'Complete',
}

export const poolStagesText = {
  [PoolStages.Open]: 'Open',
  [PoolStages.AwaitingDeal]: 'Awaiting deal',
  [PoolStages.DealReady]: 'Deal ready',
  [PoolStages.Vesting]: 'Vesting',
  [PoolStages.Complete]: 'Complete',
}
