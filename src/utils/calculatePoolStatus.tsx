import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'

import { Maybe, PoolStatus, UpfrontDeal } from '@/graphql-schema'
import { PoolStages } from '@/src/constants/pool'

export function calculateStatus<
  P extends {
    upfrontDeal?: Maybe<UpfrontDeal>
    poolStatus: PoolStatus
    purchaseExpiry: number
    vestingStarts: number
    vestingEnds: number
    dealsCreated: number
  },
>(pool: P) {
  const now = Date.now()

  let isPoolOpen = false
  let isAwaitingDeal = false
  let isAwaitingDealFunds = false
  let isVesting = false
  let isDealReady = false
  let isComplete = false

  if (pool.upfrontDeal) {
    isAwaitingDealFunds = !pool.upfrontDeal.dealStart

    isDealReady = !isAwaitingDealFunds && pool.vestingStarts > now

    isVesting = !isAwaitingDealFunds && pool.vestingStarts < now && pool.vestingEnds > now

    isComplete = !isAwaitingDealFunds && pool.vestingEnds < now
  } else {
    isPoolOpen = isBefore(now, pool.purchaseExpiry) && pool.poolStatus === PoolStatus.PoolOpen

    isAwaitingDeal = pool.poolStatus === PoolStatus.PoolOpen && isAfter(now, pool.purchaseExpiry)

    isDealReady = pool.dealsCreated > 0
    isVesting =
      pool.poolStatus === PoolStatus.DealOpen && pool.vestingStarts < now && pool.vestingEnds > now

    isComplete = pool.poolStatus === PoolStatus.DealOpen && pool.vestingEnds < now
  }

  if (isPoolOpen) return PoolStages.Open
  if (isAwaitingDeal) return PoolStages.AwaitingDeal
  if (isAwaitingDealFunds) return PoolStages.AwaitingDealFunds
  if (isVesting) return PoolStages.Vesting
  if (isDealReady && !isComplete) return PoolStages.DealReady

  return PoolStages.Complete
}
