import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'

import { PoolStatus } from '@/graphql-schema'
import { PoolStages } from '@/src/constants/pool'

export function calculateStatus<
  P extends {
    poolStatus: PoolStatus
    purchaseExpiry: number
    vestingStarts: number
    vestingEnds: number
    dealsCreated: number
  },
>(pool: P) {
  const now = Date.now()

  const isPoolOpen = isBefore(now, pool.purchaseExpiry) && pool.poolStatus === PoolStatus.PoolOpen

  const isAwaitingDeal =
    pool.poolStatus === PoolStatus.PoolOpen && isAfter(now, pool.purchaseExpiry)

  const isDealReady = pool.dealsCreated > 0
  const isVesting =
    pool.poolStatus === PoolStatus.DealOpen && pool.vestingStarts < now && pool.vestingEnds > now

  const isComplete = pool.poolStatus === PoolStatus.DealOpen && pool.vestingEnds < now

  if (isPoolOpen) return PoolStages.Open
  if (isAwaitingDeal) return PoolStages.AwaitingDeal
  if (isVesting) return PoolStages.Vesting
  if (isDealReady && !isComplete) return PoolStages.DealReady

  return PoolStages.Complete
}
