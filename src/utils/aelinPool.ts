import { BigNumber } from '@ethersproject/bignumber'
import addSeconds from 'date-fns/addSeconds'

import { formatToken } from '@/src/web3/bigNumber'

export type PoolDates = {
  timestamp: string
  duration: string
  purchaseDuration: string
  purchaseExpiry: string
}

// timestamp when the pool was created
export function getPoolCreatedDate<PD extends PoolDates>(pool: PD): Date {
  return new Date(Number(pool.timestamp) * 1000)
}

// the duration of the pool assuming no deal is presented when purchasers can withdraw all of their locked funds
export function getPurchaseExpiry<P extends PoolDates>(pool: P): Date {
  return new Date(Number(pool.purchaseExpiry) * 1000)
}

// if no deal is presented, investors can withdraw their locked funds after this date
export function getDealDeadline<P extends PoolDates>(pool: P): Date {
  const created = getPoolCreatedDate(pool)
  return addSeconds(created, Number(pool.duration) + Number(pool.purchaseDuration))
}

// returns the max amount a pool can be funded
export function getPurchaseTokenCap<
  P extends { purchaseTokenCap: string; purchaseTokenDecimals?: number },
>(pool: P) {
  return {
    raw: BigNumber.from(pool.purchaseTokenCap),
    formatted: formatToken(pool.purchaseTokenCap, pool.purchaseTokenDecimals || 0),
  }
}

// returns the sponsor's fee amount (max is 98%)
export function getSponsorFee<P extends { sponsorFee: string }>(pool: P) {
  return {
    raw: BigNumber.from(pool.sponsorFee),
    formatted: `${formatToken(pool.sponsorFee, 18, 2)}%`,
  }
}

// returns the total amount of purchase tokens that the pool holds
export function getAmountInPool<P extends { totalSupply: string; purchaseTokenDecimals: number }>(
  pool: P,
) {
  return {
    raw: BigNumber.from(pool.totalSupply),
    formatted: formatToken(pool.totalSupply, pool.purchaseTokenDecimals),
  }
}

export function getAmountFunded<P extends { purchaseTokenDecimals: number; contributions: string }>(
  pool: P,
) {
  return {
    raw: BigNumber.from(pool.contributions),
    formatted: formatToken(pool.contributions, pool.purchaseTokenDecimals),
  }
}

export function getAmountWithdrawn(amount: BigNumber) {
  return {
    raw: amount,
    formatted: formatToken(amount),
  }
}
