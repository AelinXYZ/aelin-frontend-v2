import { useMemo } from 'react'

import { ClientError } from 'graphql-request'
import { SWRConfiguration } from 'swr'

import { PoolByIdQuery, PoolCreated, PoolStatus } from '@/graphql-schema'
import { ChainsValues } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import { PoolStages } from '@/src/constants/pool'
import {
  dealExchangeRates,
  getAmountInPool,
  getAmountRedeem,
  getAmountWithdrawn,
  getDealDeadline,
  getDetailedNumber,
  getFunded,
  getPoolCreatedDate,
  getProRataRedemptionDates,
  getPurchaseExpiry,
  getPurchaseTokenCap,
  getSponsorFee,
  getVestingDates,
  getVestingEnds,
  getVestingStarts,
} from '@/src/utils/aelinPoolUtils'
import { calculateStatus } from '@/src/utils/calculatePoolStatus'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { DetailedNumber } from '@/types/utils'

export type ParsedAelinPool = {
  name: string
  nameFormatted: string
  symbol: string
  chainId: ChainsValues
  address: string
  start: Date
  investmentToken: string
  investmentTokenDecimals: number
  investmentDeadline: Date
  investmentTokenSymbol: string
  purchaseExpiry: Date
  dealDeadline: Date
  dealAddress: string | null
  sponsor: string
  sponsorFee: DetailedNumber
  poolCap: DetailedNumber
  amountInPool: DetailedNumber
  funded: DetailedNumber
  redeem: DetailedNumber
  withdrawn: DetailedNumber
  poolStatus: PoolStatus
  poolType: string
  vestingStarts: Date
  vestingEnds: Date
  dealsCreated: number
  stage: PoolStages
  deal?: {
    name: string
    symbol: string
    underlyingToken: {
      token: string
      symbol: string
      decimals: number
      // totalSupply: DetailedNumber
      // The amount of underlying tokens for the deal, for example the Sponsor offers 500k USD in exchange of the invested tokens.
      dealAmount: DetailedNumber
    }
    //purchaseTokensForDeal:
    exchangeRates: {
      investmentPerDeal: DetailedNumber
      dealPerInvestment: DetailedNumber
    }
    vestingPeriod: {
      cliff: {
        ms: number
        formatted: string
        end: Date | null
      }
      vesting: {
        ms: number
        formatted: string
        end: Date | null
      }
      end: Date | null
      start: Date | null
    }
    hasDealOpenPeriod: boolean
    redemption: {
      stage: number | null
      start: Date
      end: Date
      proRataRedemptionStart: Date
      proRataRedemptionEnd: Date
      openRedemptionEnd: Date | null
    } | null
    holderAlreadyDeposited: boolean
    holderFundingExpiration: Date
    holderFundingDuration: Date
    holderAddress: string
    createdAt: Date
    fundedAt: Date | null
    unredeemed: DetailedNumber
  }
}

export const getParsedPool = ({
  chainId,
  pool,
  poolAddress,
  purchaseTokenDecimals,
}: {
  chainId: ChainsValues
  pool: PoolCreated
  poolAddress: string
  purchaseTokenDecimals: number
}) => {
  const res: ParsedAelinPool = {
    chainId,
    poolStatus: pool.poolStatus,
    name: pool.name,
    symbol: pool.symbol,
    nameFormatted: pool.name.split('aePool-').pop() || '',
    poolType: pool.hasAllowList ? 'Private' : 'Public',
    address: poolAddress,
    start: getPoolCreatedDate(pool),
    investmentToken: pool.purchaseToken,
    investmentTokenSymbol: pool.purchaseTokenSymbol,
    investmentTokenDecimals: purchaseTokenDecimals,
    investmentDeadline: pool.purchaseDuration,
    sponsor: pool.sponsor,
    dealAddress: pool.dealAddress ? (pool.dealAddress as string) : null,
    sponsorFee: getSponsorFee(pool),
    poolCap: getPurchaseTokenCap({ ...pool, purchaseTokenDecimals }),
    purchaseExpiry: getPurchaseExpiry(pool),
    dealDeadline: getDealDeadline(pool),
    amountInPool: getAmountInPool({ ...pool, purchaseTokenDecimals }),
    funded: getFunded({ ...pool, purchaseTokenDecimals }),
    withdrawn: getAmountWithdrawn(pool.totalAmountWithdrawn || ZERO_BN, purchaseTokenDecimals),
    redeem: getAmountRedeem(pool.totalAmountAccepted || ZERO_BN, purchaseTokenDecimals),
    vestingStarts: getVestingStarts(pool),
    vestingEnds: getVestingEnds(pool),
    stage: calculateStatus({
      poolStatus: pool.poolStatus,
      purchaseExpiry: getPurchaseExpiry(pool).getTime(),
      vestingStarts: getVestingStarts(pool).getTime(),
      vestingEnds: getVestingEnds(pool).getTime(),
      dealsCreated: pool.dealsCreated,
    }),
    deal: undefined,
    dealsCreated: pool.dealsCreated,
  }

  const dealDetails = pool.deal
  if (!dealDetails) {
    return res
  }

  const redemptionInfo = dealDetails.proRataRedemptionPeriodStart
    ? getProRataRedemptionDates(
        // proRataRedemptionPeriodStart is set when Deal is founded by the Holder
        dealDetails.proRataRedemptionPeriodStart,
        dealDetails.proRataRedemptionPeriod,
        dealDetails.openRedemptionPeriod,
      )
    : null

  res.deal = {
    name: dealDetails.name.split('aeDeal-').pop() || '',
    symbol: dealDetails.symbol,
    underlyingToken: {
      token: dealDetails.underlyingDealToken,
      symbol: dealDetails.underlyingDealTokenSymbol,
      decimals: dealDetails.underlyingDealTokenDecimals,
      dealAmount: getDetailedNumber(
        dealDetails.underlyingDealTokenTotal,
        dealDetails.underlyingDealTokenDecimals,
      ),
    },
    exchangeRates: dealExchangeRates(
      dealDetails.purchaseTokenTotalForDeal,
      purchaseTokenDecimals,
      dealDetails.underlyingDealTokenTotal,
      dealDetails.underlyingDealTokenDecimals,
    ),
    vestingPeriod: getVestingDates(
      redemptionInfo?.end,
      dealDetails.vestingCliff,
      dealDetails.vestingPeriod,
    ),
    hasDealOpenPeriod: !!dealDetails.openRedemptionStart,
    redemption: redemptionInfo,
    holderAlreadyDeposited: dealDetails.isDealFunded,
    holderFundingExpiration: new Date(dealDetails.holderFundingExpiration * 1000),
    holderFundingDuration: dealDetails.holderFundingDuration,
    holderAddress: dealDetails.holder,
    createdAt: new Date(dealDetails.timestamp * 1000),
    fundedAt: dealDetails.isDealFunded ? new Date(dealDetails.dealFundedAt * 1000) : null,
    unredeemed: getDetailedNumber(
      dealDetails.totalAmountUnredeemed || ZERO_BN,
      dealDetails.underlyingDealTokenDecimals,
    ),
  }

  return res
}

export default function useAelinPool(
  chainId: ChainsValues,
  poolAddress: string,
  config?: SWRConfiguration<PoolByIdQuery, ClientError>,
): { refetch: () => void; pool: ParsedAelinPool } {
  const allSDK = getAllGqlSDK()
  const { usePoolById } = allSDK[chainId]
  const { data: poolCreatedData, mutate: poolCreatedMutate } = usePoolById(
    {
      poolCreatedId: poolAddress,
    },
    config,
  )

  const refetch = () => {
    poolCreatedMutate()
  }

  if (!poolCreatedData?.poolCreated) {
    throw Error('It was not possible to fetch pool id: ' + poolAddress)
  }

  const pool = poolCreatedData.poolCreated as PoolCreated
  const purchaseTokenDecimals = pool.purchaseTokenDecimals

  // prevent TS error
  if (!purchaseTokenDecimals) {
    throw Error('PurchaseTokenDecimals is null or undefined for pool: ' + poolAddress)
  }

  const memoizedPool = useMemo(() => {
    const poolInfo: ParsedAelinPool = getParsedPool({
      pool,
      purchaseTokenDecimals,
      poolAddress,
      chainId,
    })

    return poolInfo
  }, [pool, purchaseTokenDecimals, poolAddress, chainId])

  return {
    refetch,
    pool: memoizedPool,
  }
}
