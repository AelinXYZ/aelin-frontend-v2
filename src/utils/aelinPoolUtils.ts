import { BigNumber } from '@ethersproject/bignumber'
import Wei from '@synthetixio/wei'
import addMilliseconds from 'date-fns/addMilliseconds'
import addSeconds from 'date-fns/addSeconds'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'

import { ParsedAelinPool } from '../hooks/aelin/useAelinPool'
import { PoolStages } from '@/src/constants/pool'
import { getFormattedDurationFromDateToNow } from '@/src/utils/date'
import { formatToken } from '@/src/web3/bigNumber'
import { DetailedNumber } from '@/types/utils'

export type PoolDates = {
  timestamp: string
  duration: string
  purchaseDuration: string
  purchaseExpiry: string
  vestingStarts: string
  vestingEnds: string
}

// timestamp when the pool was created
export function getPoolCreatedDate<PD extends PoolDates>(pool: PD): Date {
  return new Date(Number(pool.timestamp) * 1000)
}

// the duration of the pool assuming no deal is presented when purchasers can withdraw all of their locked funds
export function getPurchaseExpiry<P extends PoolDates>(pool: P): Date {
  return new Date(Number(pool.purchaseExpiry) * 1000)
}

export function getVestingStarts<P extends PoolDates>(pool: P): Date {
  return new Date(Number(pool.vestingStarts) * 1000)
}

export function getVestingEnds<P extends PoolDates>(pool: P): Date {
  return new Date(Number(pool.vestingEnds) * 1000)
}

// if no deal is presented, investors can withdraw their locked funds after this date
export function getDealDeadline<P extends PoolDates>(pool: P): Date {
  const created = getPoolCreatedDate(pool)
  return addSeconds(created, Number(pool.duration) + Number(pool.purchaseDuration))
}

// returns the max amount a pool can raise from investors
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

// returns the total amount of tokens the users deposited
export function getAmountInPool<P extends { totalSupply: string; purchaseTokenDecimals: number }>(
  pool: P,
) {
  return {
    raw: BigNumber.from(pool.totalSupply),
    formatted: formatToken(pool.totalSupply, pool.purchaseTokenDecimals),
  }
}

export function getFunded<P extends { purchaseTokenDecimals: number; contributions: string }>(
  pool: P,
) {
  return {
    raw: BigNumber.from(pool.contributions),
    formatted: formatToken(pool.contributions, pool.purchaseTokenDecimals),
  }
}

export function getAmountWithdrawn(amount: BigNumber, purchaseTokenDecimals: number) {
  return {
    raw: amount,
    formatted: formatToken(amount, purchaseTokenDecimals),
  }
}

export function getAmountRedeem(amount: BigNumber, purchaseTokenDecimals: number) {
  return {
    raw: amount,
    formatted: formatToken(amount, purchaseTokenDecimals),
  }
}

export function getAmountUnRedeemed(
  funded: string,
  redeemed: string,
  decimals: number,
): DetailedNumber {
  const fundedBg = BigNumber.from(funded)
  const redeemedBg = BigNumber.from(redeemed)
  return {
    raw: fundedBg.sub(redeemedBg),
    formatted: formatToken(fundedBg.sub(redeemedBg), decimals),
  }
}

export function getStatusText<P extends { poolStatus: PoolStages }>(pool: P) {
  return pool.poolStatus.replace(/([a-z])([A-Z])/g, '$1 $2')
}

export function getDetailedNumber(amount: string, decimals: number) {
  return {
    raw: BigNumber.from(amount),
    formatted: formatToken(amount, decimals),
  }
}

export function dealExchangeRates(
  investmentTokenAmount: string,
  investmentTokenDecimals: number,
  dealTokenAmount: string,
  dealTokenDecimals: number,
) {
  const investmentToken = new Wei(investmentTokenAmount, investmentTokenDecimals, true)
  const dealToken = new Wei(dealTokenAmount, dealTokenDecimals, true)

  const investmentRate = dealToken.div(investmentToken)
  const dealRate = new Wei(1).div(investmentRate)

  return {
    investmentPerDeal: {
      raw: investmentRate.toBN(),
      formatted: formatToken(investmentRate.toBN(), dealTokenDecimals, 3),
    },
    dealPerInvestment: {
      raw: dealRate.toBN(),
      formatted: formatToken(dealRate.toBN(), 18),
    },
  }
}

export function getProRataRedemptionDates(
  proRataRedemptionPeriodStart: string,
  proRataRedemptionPeriod: string,
  openRedemptionPeriod: string,
) {
  const now = Date.now()

  const proRataRedemptionStart = new Date(Number(proRataRedemptionPeriodStart) * 1000)
  const proRataRedemptionEnd = addSeconds(proRataRedemptionStart, Number(proRataRedemptionPeriod))

  const openRedemptionEnd =
    openRedemptionPeriod !== '0'
      ? addSeconds(proRataRedemptionEnd, Number(openRedemptionPeriod))
      : null

  const stage = isBefore(now, proRataRedemptionEnd)
    ? 1
    : openRedemptionEnd && isBefore(now, openRedemptionEnd)
    ? 2
    : null

  const start = proRataRedemptionStart
  const end = openRedemptionEnd ? openRedemptionEnd : proRataRedemptionEnd

  return {
    stage,
    start,
    end,
    proRataRedemptionStart,
    proRataRedemptionEnd,
    openRedemptionEnd,
  }
}
export function getVestingDates(
  redemptionEnd: Date | undefined,
  vestingCliff: string,
  vestingPeriod: string,
) {
  const now = new Date()
  const cliffMs = Number(vestingCliff ?? 0) * 1000
  const vestingMs = Number(vestingPeriod ?? 0) * 1000

  const cliff = {
    ms: cliffMs,
    formatted: formatDistanceStrict(now, addMilliseconds(now, cliffMs)),
    end: redemptionEnd ? addMilliseconds(redemptionEnd, cliffMs) : null,
  }
  const vesting = {
    ms: vestingMs,
    formatted: formatDistanceStrict(now, addMilliseconds(now, vestingMs)),
    end: redemptionEnd ? addMilliseconds(redemptionEnd, cliffMs + vestingMs) : null,
  }
  const end = redemptionEnd ? addMilliseconds(redemptionEnd, cliff.ms + vesting.ms) : null
  const start = redemptionEnd ? addMilliseconds(redemptionEnd, cliff.ms) : null

  return { cliff, vesting, end, start }
}

export function calculateInvestmentDeadlineProgress(purchaseExpiry: Date, start: Date) {
  if (getFormattedDurationFromDateToNow(purchaseExpiry, 'ended') === 'ended') {
    return '0'
  }

  const end = purchaseExpiry
  const today = new Date()

  //use Math.abs to avoid sign
  const q = Math.abs(today.getTime() - start.getTime())
  const d = Math.abs(end.getTime() - start.getTime())

  return Math.round((q / d) * 100).toString()
}

export function calculateDeadlineProgress(deadline: Date, start: Date) {
  const now = new Date()
  if (isBefore(now, start)) {
    return '0'
  }

  if (isAfter(now, deadline)) {
    return '0'
  }

  const completed = deadline.getTime() - now.getTime()
  const target = deadline.getTime() - start.getTime()

  return Math.ceil((completed / target) * 100).toString()
}

export function getCurrentStage(pool: ParsedAelinPool) {
  const now = Date.now()

  // Open
  if (isBefore(now, pool.purchaseExpiry)) {
    return PoolStages.Open
  }

  // Awaiting deal
  if (isAfter(now, pool.purchaseExpiry) && !pool.deal?.holderAlreadyDeposited) {
    return PoolStages.AwaitingDeal
  }

  // Dealing
  // isAfter(now, pool.dealDeadline)
  // isBefore(now, pool.dealDeadline)
  if (
    pool.deal &&
    pool.deal.holderAlreadyDeposited &&
    pool.deal.redemption &&
    isBefore(now, pool.deal.redemption?.end)
    //isAfter(now, pool.deal?.redemption?.start) &&
    // isBefore(now, pool.deal?.redemption?.end)
  ) {
    return PoolStages.DealReady
  }

  // Vesting
  if (
    pool.deal &&
    pool.deal.holderAlreadyDeposited &&
    pool.deal.redemption &&
    isAfter(now, pool.deal.redemption?.end) &&
    pool.deal.vestingPeriod.end &&
    isBefore(now, pool.deal.vestingPeriod.end)
  ) {
    return PoolStages.Vesting
  }

  // TODO: Handle different states of closed
  return PoolStages.Complete
}
