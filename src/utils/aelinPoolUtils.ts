import { BigNumber } from '@ethersproject/bignumber'
import { HashZero } from '@ethersproject/constants'
import Wei from '@synthetixio/wei'
import addMilliseconds from 'date-fns/addMilliseconds'
import addSeconds from 'date-fns/addSeconds'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'

import { BASE_DECIMALS, DISPLAY_DECIMALS, EXCHANGE_DECIMALS, ZERO_BN } from '../constants/misc'
import { ParsedAelinPool } from '../hooks/aelin/useAelinPool'
import { DealType, PoolCreated } from '@/graphql-schema'
import {
  NftType,
  NftWhiteListState,
  NftWhitelistProcess,
} from '@/src/components/pools/whitelist/nft//nftWhiteListReducer'
import { PoolStages, Privacy } from '@/src/constants/pool'
import { NftCollectionRulesProps } from '@/src/hooks/aelin/useAelinCreatePool'
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

export interface RawNftCollectionRules {
  collectionAddress: string
  erc721Blacklisted: string[]
  erc1155TokenIds: string[]
  erc1155TokensAmtEligible: string[]
  nftType: 'ERC721' | 'ERC1155'
  poolAddress: string
  purchaseAmount: string
  purchaseAmountPerToken: boolean
}

export interface ParsedNftCollectionRules extends Omit<RawNftCollectionRules, 'purchaseAmount'> {
  purchaseAmount: {
    raw: BigNumber
    formatted: string | undefined
  }
}

// timestamp when the pool was created
export function getPoolCreatedDate(pool: PoolCreated): Date {
  return new Date(Number(pool.timestamp) * 1000)
}

// the duration of the pool assuming no deal is presented when purchasers can withdraw all of their locked funds
export function getPurchaseExpiry(pool: PoolCreated): Date | null {
  return pool.purchaseExpiry ? new Date(Number(pool.purchaseExpiry) * 1000) : null
}

export function getVestingStarts(pool: PoolCreated): Date | null {
  return pool.vestingStarts ? new Date(Number(pool.vestingStarts) * 1000) : null
}

export function getVestingEnds(pool: PoolCreated): Date | null {
  return pool.vestingEnds ? new Date(Number(pool.vestingEnds) * 1000) : null
}

// if no deal is presented, investors can withdraw their locked funds after this date
export function getDealDeadline(pool: PoolCreated): Date | null {
  if (pool.dealType === DealType.UpfrontDeal) {
    return null
  }
  const created = getPoolCreatedDate(pool)
  return addSeconds(created, Number(pool.duration) + Number(pool.purchaseDuration))
}

// returns the max amount a pool can raise from investors
export function getPurchaseTokenCap<
  P extends { purchaseTokenCap: string; purchaseTokenDecimals?: number },
>(pool: P) {
  return {
    raw: BigNumber.from(pool.purchaseTokenCap),
    formatted: formatToken(
      pool.purchaseTokenCap,
      pool.purchaseTokenDecimals || BASE_DECIMALS,
      DISPLAY_DECIMALS,
    ),
  }
}

// returns the sponsor's fee amount
export function getSponsorFee(pool: PoolCreated) {
  return {
    raw: BigNumber.from(pool.sponsorFee),
    formatted: `${formatToken(pool.sponsorFee, BASE_DECIMALS, DISPLAY_DECIMALS)}%`,
  }
}

// returns the total amount of tokens the users deposited
export function getAmountInPool<P extends { totalSupply: string; purchaseTokenDecimals: number }>(
  pool: P,
) {
  return {
    raw: BigNumber.from(pool.totalSupply),
    formatted: formatToken(pool.totalSupply, pool.purchaseTokenDecimals, DISPLAY_DECIMALS),
  }
}

export function getFunded<P extends { purchaseTokenDecimals: number; contributions: string }>(
  pool: P,
) {
  return {
    raw: BigNumber.from(pool.contributions),
    formatted: formatToken(pool.contributions, pool.purchaseTokenDecimals, DISPLAY_DECIMALS),
  }
}

export function getAmountWithdrawn(amount: BigNumber, purchaseTokenDecimals: number) {
  return {
    raw: amount,
    formatted: formatToken(amount, purchaseTokenDecimals, DISPLAY_DECIMALS),
  }
}

export function getAmountRedeem(amount: BigNumber, purchaseTokenDecimals: number) {
  return {
    raw: amount,
    formatted: formatToken(amount, purchaseTokenDecimals, DISPLAY_DECIMALS),
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
  const dealRate = new Wei(1, dealTokenDecimals).div(investmentRate)

  return {
    investmentPerDeal: {
      raw: investmentRate.toBN(),
      formatted: formatToken(
        investmentRate.toBN(),
        dealTokenDecimals > investmentTokenDecimals ? dealTokenDecimals : investmentTokenDecimals,
        EXCHANGE_DECIMALS,
      ),
    },
    dealPerInvestment: {
      raw: dealRate.toBN(),
      formatted: formatToken(dealRate.toBN(), dealTokenDecimals, EXCHANGE_DECIMALS),
    },
  }
}

export function upfrontDealExchangeRates(
  purchaseTokenPerDealToken: string,
  investmentTokenDecimals: number,
  dealTokenDecimals: number,
) {
  const investmentRate = new Wei(purchaseTokenPerDealToken, investmentTokenDecimals, true)
  const dealRate = new Wei(1).div(investmentRate)

  return {
    investmentPerDeal: {
      raw: investmentRate.toBN(),
      formatted: formatToken(investmentRate.toBN(), investmentTokenDecimals, EXCHANGE_DECIMALS),
    },
    dealPerInvestment: {
      raw: dealRate.toBN(),
      formatted: formatToken(dealRate.toBN(), dealTokenDecimals, EXCHANGE_DECIMALS),
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

  if (pool.upfrontDeal) {
    const { upfrontDeal } = pool
    // Awaiting Deal
    if (!upfrontDeal.dealStart) {
      return PoolStages.AwaitingDeal
    }

    // DealReady
    if (upfrontDeal.dealStart && pool.vestingStarts && isBefore(now, pool.vestingStarts)) {
      return PoolStages.AwaitingDeal
    }

    // Vesting
    if (
      upfrontDeal.dealStart &&
      pool.vestingStarts &&
      pool.vestingEnds &&
      isAfter(now, pool.vestingStarts) &&
      isBefore(now, pool.vestingEnds)
    ) {
      return PoolStages.AwaitingDeal
    }

    return PoolStages.Complete
  }
  // Open
  if (!pool.purchaseExpiry || (pool.purchaseExpiry && isBefore(now, pool.purchaseExpiry))) {
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

export function isPrivatePool(poolType: string) {
  return poolType.toLowerCase() === Privacy.PRIVATE
}

export function isMerklePool(pool: ParsedAelinPool | PoolCreated): boolean {
  return (
    pool.upfrontDeal?.merkleRoot !== HashZero &&
    pool.upfrontDeal?.merkleRoot !== undefined &&
    pool.upfrontDeal?.merkleRoot !== null
  )
}

export function getPoolType(pool: ParsedAelinPool) {
  if (pool.hasNftList) return 'NFT'

  if (isMerklePool(pool)) return 'Merkle Tree'

  switch (pool.poolType.toLowerCase()) {
    case Privacy.PRIVATE: {
      return 'Private'
    }
    case Privacy.PUBLIC: {
      return 'Public'
    }
    default: {
      throw new Error('Unexpected pool')
    }
  }
}

export function getTokensSold(
  redeemed: DetailedNumber,
  rate: DetailedNumber,
  investmentTokenDecimals: number,
  dealTokenDecimals: number,
) {
  const _redeemed = new Wei(redeemed.raw, investmentTokenDecimals, true)
  const _rate = new Wei(rate.raw, dealTokenDecimals, true)
  const tokensSold = _redeemed.div(_rate).toBN()
  return {
    raw: tokensSold,
    formatted: formatToken(tokensSold, investmentTokenDecimals),
  }
}

export function getInvestmentDealToken(
  underlyingDealTokenTotal: string,
  underlyingDecimals: number,
  exchangeRate: DetailedNumber,
) {
  const _underlyingDealTokenTotal = new Wei(underlyingDealTokenTotal, underlyingDecimals, true)
  const _exchangeRate = new Wei(exchangeRate.raw, underlyingDecimals, true)
  const _investmentDealToken = _underlyingDealTokenTotal.mul(_exchangeRate).toBN()
  return {
    raw: _investmentDealToken,
    formatted: formatToken(_investmentDealToken, underlyingDecimals, DISPLAY_DECIMALS),
  }
}

export function parseNftCollectionRules(pool: PoolCreated): ParsedNftCollectionRules[] {
  return pool.nftCollectionRules.map((collectionRule) => {
    const purchaseAmountBN = new Wei(
      collectionRule.purchaseAmount,
      pool.purchaseTokenDecimals || BASE_DECIMALS,
      true,
    )

    return {
      ...collectionRule,
      purchaseAmount: {
        raw: purchaseAmountBN.toBN(),
        formatted: formatToken(
          collectionRule.purchaseAmount,
          pool.purchaseTokenDecimals || BASE_DECIMALS,
          DISPLAY_DECIMALS,
        ),
      },
    }
  })
}

export const getParsedNftCollectionRules = (
  nftWhiteListState: NftWhiteListState,
): NftCollectionRulesProps[] => {
  const nftCollectionRules = nftWhiteListState.selectedCollections.map((collection) => {
    const collectionAddress = collection.nftCollectionData?.address ?? ''

    const purchaseAmountPerToken = [
      NftWhitelistProcess.limitedPerNft,
      NftWhitelistProcess.unlimited,
    ].includes(nftWhiteListState.whiteListProcess)

    let purchaseAmount = 0
    let tokenIds: Array<BigNumber> = []
    let minTokensEligible: Array<BigNumber> = []

    if (nftWhiteListState.nftType === NftType.erc721) {
      purchaseAmount =
        NftWhitelistProcess.unlimited === nftWhiteListState.whiteListProcess
          ? 0
          : NftWhitelistProcess.limitedPerNft === nftWhiteListState.whiteListProcess
          ? collection.amountPerNft ?? 0
          : collection.amountPerWallet ?? 0
    }

    if (nftWhiteListState.nftType === NftType.erc1155) {
      tokenIds = collection.selectedNftsData.map((collection) => {
        return BigNumber.from(collection.nftId as number)
      })

      minTokensEligible = collection.selectedNftsData.map((collection) =>
        BigNumber.from(collection.minimumAmount),
      )
    }

    return {
      collectionAddress,
      purchaseAmountPerToken,
      purchaseAmount,
      tokenIds,
      minTokensEligible,
    }
  })

  return nftCollectionRules
}

export function parseUpfrontDeal(pool: PoolCreated) {
  const { purchaseTokenDecimals, upfrontDeal } = pool
  if (!upfrontDeal || !purchaseTokenDecimals) return
  const now = new Date()
  const cliffMs = Number(upfrontDeal.vestingCliffPeriod ?? 0) * 1000
  const vestingMs = Number(upfrontDeal.vestingPeriod ?? 0) * 1000
  const dealStart = upfrontDeal.dealStart ? new Date(Number(upfrontDeal.dealStart) * 1000) : null
  const vestingStarts = pool.vestingStarts ? new Date(Number(pool.vestingStarts) * 1000) : null
  const vestingEnds = pool.vestingEnds ? new Date(Number(pool.vestingEnds) * 1000) : null

  const exchangeRates = upfrontDealExchangeRates(
    upfrontDeal.purchaseTokenPerDealToken,
    purchaseTokenDecimals,
    upfrontDeal.underlyingDealTokenDecimals,
  )

  return {
    address: upfrontDeal.id,
    name: upfrontDeal.name,
    symbol: upfrontDeal.symbol,
    holder: upfrontDeal.holder,
    allowDeallocation: upfrontDeal.allowDeallocation,
    underlyingToken: {
      token: upfrontDeal.underlyingDealToken,
      symbol: upfrontDeal.underlyingDealTokenSymbol,
      decimals: upfrontDeal.underlyingDealTokenDecimals,
      dealAmount: getDetailedNumber(
        upfrontDeal.underlyingDealTokenTotal,
        upfrontDeal.underlyingDealTokenDecimals,
      ),
      totalSupply: getDetailedNumber(
        upfrontDeal.underlyingDealTokenTotalSupply,
        upfrontDeal.underlyingDealTokenDecimals,
      ),
      remaining: getDetailedNumber(
        upfrontDeal.remainingDealTokens,
        upfrontDeal.underlyingDealTokenDecimals,
      ),
      totalRedeemed: getDetailedNumber(
        upfrontDeal.totalRedeemed,
        upfrontDeal.underlyingDealTokenDecimals,
      ),
    },
    exchangeRates,
    maxDealTotalSupply: getDetailedNumber(
      upfrontDeal.maxDealTotalSupply,
      upfrontDeal.underlyingDealTokenDecimals,
    ),
    purchaseRaiseMinimum: getDetailedNumber(
      upfrontDeal.purchaseRaiseMinimum,
      Number(purchaseTokenDecimals),
    ),
    purchaseTokenPerDealToken: getDetailedNumber(
      // Double check
      upfrontDeal.purchaseTokenPerDealToken,
      Number(purchaseTokenDecimals),
    ),
    purchaseTokenTotalForDeal: getDetailedNumber(
      upfrontDeal.purchaseTokenTotalForDeal,
      upfrontDeal.underlyingDealTokenDecimals,
    ),
    vestingPeriod: {
      cliff: {
        ms: cliffMs,
        formatted: formatDistanceStrict(now, addMilliseconds(now, cliffMs)),
        end: vestingStarts ? addMilliseconds(vestingStarts, cliffMs) : null,
      },
      vesting: {
        ms: vestingMs,
        formatted: formatDistanceStrict(now, addMilliseconds(now, vestingMs)),
        end: vestingEnds,
      },
      start: vestingStarts,
      end: vestingEnds,
    },
    unredeemed: getDetailedNumber(
      upfrontDeal.totalAmountUnredeemed || ZERO_BN,
      upfrontDeal.underlyingDealTokenDecimals,
    ),
    dealStart,
    holderClaim: !!upfrontDeal.holderClaim,
    sponsorClaim: !!upfrontDeal.sponsorClaim,
    totalUsersAccepted: upfrontDeal.totalUsersAccepted,
    merkleRoot: upfrontDeal.merkleRoot || null,
    ipfsHash: upfrontDeal.ipfsHash || null,
  }
}
