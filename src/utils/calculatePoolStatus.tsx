import { PoolStatus } from '@/graphql-schema'
import { ExtendedStatus, allStages } from '@/src/constants/pool'

export function calculateStatus<P extends { poolStatus: ExtendedStatus; purchaseExpiry: number }>(
  pool: P,
) {
  const now = Date.now()
  if (pool.poolStatus === PoolStatus.PoolOpen && now > pool.purchaseExpiry) {
    return allStages.SeekingDeal
  }
  return pool.poolStatus
}
