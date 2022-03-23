import { PoolStatus } from '@/graphql-schema'

// 20 pool results by chain
export const POOLS_RESULTS_PER_CHAIN = 20

export const STATUS_TEXT = {
  [PoolStatus.PoolOpen]: 'Pool Open',
  [PoolStatus.DealOpen]: 'Deal',
  [PoolStatus.FundingDeal]: 'Funding Deal',
  default: 'Unknown',
}
