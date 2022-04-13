import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { ClientError } from 'graphql-request'
import { SWRConfiguration } from 'swr'

import { PoolByIdQuery, PoolCreated, PoolStatus } from '@/graphql-schema'
import { ChainsValues } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import useAelinPoolCall from '@/src/hooks/aelin/useAelinPoolCall'
import {
  dealExchangeRates,
  getAmountInPool,
  getAmountWithdrawn,
  getDealDeadline,
  getDetailedNumber,
  getInvestmentRaisedAmount,
  getPoolCreatedDate,
  getProRataRedemptionDates,
  getPurchaseExpiry,
  getPurchaseTokenCap,
  getSponsorFee,
  hasDealOpenPeriod,
} from '@/src/utils/aelinPoolUtils'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'

type DetailedNumber = {
  raw: BigNumber
  formatted: string | undefined
}

type ParsedDeal = {
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
  vesting: {
    cliff: number
    linear: number
  }
  hasDealOpenPeriod: boolean
  proRataRedemption: {
    stage: number | null
    proRataRedemptionStart: Date
    proRataRedemptionEnd: Date
    openRedemptionEnd: Date | null
  } | null
  holderAlreadyDeposited: boolean
  holderDepositExpiration: Date
  holderDepositDuration: Date
  holderAddress: string
}

export type ParsedAelinPool = {
  name: string
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
  investmentRaisedAmount: DetailedNumber
  withdrawn: DetailedNumber
  deal: undefined | ParsedDeal
  poolStatus: PoolStatus
}

export const getParsedPool = ({
  chainId,
  pool,
  poolAddress,
  poolTotalWithdrawn,
  purchaseTokenDecimals,
}: {
  chainId: ChainsValues
  pool: PoolCreated
  poolAddress: string
  poolTotalWithdrawn: BigNumber | null
  purchaseTokenDecimals: number
}) => {
  return {
    chainId,
    poolStatus: pool.poolStatus,
    name: pool.name,
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
    investmentRaisedAmount: getInvestmentRaisedAmount({ ...pool, purchaseTokenDecimals }),
    withdrawn: getAmountWithdrawn(poolTotalWithdrawn || ZERO_BN),
    deal: undefined,
  }
}

export default function useAelinPool(
  chainId: ChainsValues,
  poolAddress: string,
  config?: SWRConfiguration<PoolByIdQuery, ClientError>,
): { refetch: () => void; pool: ParsedAelinPool } {
  const allSDK = getAllGqlSDK()
  const { useDealById, useDealDetailsById, usePoolById } = allSDK[chainId]
  const { data: poolCreatedData, mutate: poolCreatedMutate } = usePoolById(
    {
      poolCreatedId: poolAddress,
    },
    config,
  )

  // TODO: Fetch from subgraph
  const { data: dealCreatedData, mutate: dealCreatedMutate } = useDealById(
    {
      dealAddress: poolCreatedData?.poolCreated?.dealAddress || '',
    },
    config,
  )
  // TODO: Fetch from subgraph
  const { data: dealDetailsData, mutate: dealDetailsMutate } = useDealDetailsById(
    {
      dealAddress: poolCreatedData?.poolCreated?.dealAddress || '',
    },
    config,
  )

  const refetch = () => {
    poolCreatedMutate()
    dealCreatedMutate()
    dealDetailsMutate()
  }

  const [poolTotalWithdrawn] = useAelinPoolCall(chainId, poolAddress, 'totalAmountWithdrawn', [])

  if (!poolCreatedData?.poolCreated) {
    throw Error('There was not possible to fetch pool id: ' + poolAddress)
  }

  if (!poolTotalWithdrawn) {
    throw Error('There was not possible to fetch poolTotalWithdrawn: ' + poolAddress)
  }

  const pool = poolCreatedData.poolCreated
  const purchaseTokenDecimals = pool.purchaseTokenDecimals

  // prevent TS error
  if (!purchaseTokenDecimals) {
    throw Error('PurchaseTokenDecimals is null or undefined for pool: ' + poolAddress)
  }

  const memoizedPool = useMemo(() => {
    const poolInfo: ParsedAelinPool = getParsedPool({
      pool,
      purchaseTokenDecimals,
      poolTotalWithdrawn,
      poolAddress,
      chainId,
    })

    // Add deal info
    const dealCreated = dealCreatedData?.dealCreated
    const dealDetails = dealDetailsData?.dealDetail

    if (poolInfo.dealAddress && dealCreated && dealDetails) {
      poolInfo.deal = {
        name: dealCreated.name,
        symbol: dealCreated.symbol,
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
          pool.contributions,
          purchaseTokenDecimals,
          dealDetails.underlyingDealTokenTotal,
          dealDetails.underlyingDealTokenDecimals,
        ),
        vesting: {
          cliff: dealDetails.vestingCliff,
          linear: dealDetails.vestingPeriod,
        },
        hasDealOpenPeriod: hasDealOpenPeriod(
          pool.contributions,
          dealDetails.purchaseTokenTotalForDeal,
        ),
        proRataRedemption: dealDetails.proRataRedemptionPeriodStart
          ? getProRataRedemptionDates(
              // proRataRedemptionPeriodStart is set when Deal is founded by the Holder
              dealDetails.proRataRedemptionPeriodStart,
              dealDetails.proRataRedemptionPeriod,
              dealDetails.openRedemptionPeriod,
            )
          : null,
        holderAlreadyDeposited: false,
        holderDepositExpiration: new Date(),
        holderDepositDuration: new Date(),
        holderAddress: dealDetails.holder,
      }
    }

    return poolInfo
  }, [
    pool,
    purchaseTokenDecimals,
    poolTotalWithdrawn,
    poolAddress,
    chainId,
    dealCreatedData,
    dealDetailsData,
  ])

  return {
    refetch,
    pool: memoizedPool,
  }
}
