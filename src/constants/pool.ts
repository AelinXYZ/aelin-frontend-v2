// 20 pool results by chain
import { PoolStatus } from '@/graphql-schema'

export const POOLS_RESULTS_PER_CHAIN = 20
export const VESTING_DEALS_RESULTS_PER_CHAIN = 20
export const NOTIFICATIONS_RESULTS_PER_CHAIN = 20
export const USERS_RESULTS_PER_CHAIN = 20

export const HISTORY_RESULTS_PER_CHAIN = 20

export enum Privacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum LocalStatus {
  SeekingDeal = 'SeekingDeal',
  ProRataRedemption = 'ProRataRedemption',
  OpenRedemption = 'OpenRedemption',
  Closed = 'Closed',
}

export type ExtendedStatus = PoolStatus | LocalStatus
export const allStages = { ...PoolStatus, ...LocalStatus }
