import { useCallback } from 'react'

import orderBy from 'lodash/orderBy'
import useSWRInfinite from 'swr/infinite'

import { DealSponsored_OrderBy, DealSponsoredsQueryVariables } from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { BASE_DECIMALS } from '@/src/constants/misc'
import { HISTORY_RESULTS_PER_CHAIN } from '@/src/constants/pool'
import { DEALS_SPONSORED_QUERY_NAME } from '@/src/queries/history/dealsSponsored'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isSuccessful } from '@/src/utils/isSuccessful'
import { parsePoolName } from '@/src/utils/parsePoolName'
import { formatToken } from '@/src/web3/bigNumber'

export type ParsedDealSponsoredHistory = {
  id: string
  poolName: string
  network: ChainsValues
  timestamp: Date
  amountEarned: string
  totalAccepted: string
  totalInvested: string
}

export async function fetcherDealsSponsored(variables: DealSponsoredsQueryVariables) {
  const allSDK = getAllGqlSDK()

  const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const queryPromises = (): Promise<any>[] =>
    chainIds.map((chainId: ChainsValues) =>
      allSDK[chainId][DEALS_SPONSORED_QUERY_NAME](variables)
        .then((res) => {
          return res.dealSponsoreds.map((dealSponsored) => {
            const totalInvested = formatToken(
              dealSponsored.totalInvested,
              dealSponsored.pool.purchaseTokenDecimals || 0,
            )

            const totalAccepted = formatToken(
              dealSponsored.totalAccepted,
              dealSponsored.pool.deal?.underlyingDealTokenDecimals ||
                dealSponsored.pool.upfrontDeal?.underlyingDealTokenDecimals ||
                0,
            )

            const amountEarned = formatToken(
              dealSponsored.amountEarned,
              dealSponsored.pool.deal?.underlyingDealTokenDecimals || 0,
            )

            const sponsorFee = formatToken(dealSponsored.pool.sponsorFee, BASE_DECIMALS)

            return {
              id: dealSponsored.pool.id,
              network: chainId,
              poolName: parsePoolName(dealSponsored.pool.name),
              timestamp: new Date(dealSponsored.timestamp * 1000),
              totalInvested: `${totalInvested} ${dealSponsored.pool.purchaseTokenSymbol}`,
              amountEarned: `${amountEarned} ${dealSponsored.pool.purchaseTokenSymbol} (${sponsorFee}%)`,
              totalAccepted: `${totalAccepted} ${dealSponsored.pool.upfrontDeal?.underlyingDealTokenSymbol}`,
            }
          })
        })
        .catch((err) => {
          console.error(`fetch deals sponsored on chain ${chainId} was failed`, err)
          return []
        }),
    )

  try {
    const dealsSponsoredByChainResponses = await Promise.allSettled(queryPromises())

    let result = dealsSponsoredByChainResponses
      .filter(isSuccessful)
      .reduce((resultAcc: ParsedDealSponsoredHistory[], { value }) => [...resultAcc, ...value], [])

    result = orderBy(
      result,
      variables.orderBy as DealSponsored_OrderBy,
      variables.orderDirection ? [variables.orderDirection] : ['desc'],
    )

    return result
  } catch (err) {
    console.error(err)
    return []
  }
}

const getSwrKey = (
  currentPage: number,
  previousPageData: ParsedDealSponsoredHistory[],
  variables: DealSponsoredsQueryVariables,
) => {
  return [
    {
      ...variables,
      skip: currentPage * HISTORY_RESULTS_PER_CHAIN,
      first: HISTORY_RESULTS_PER_CHAIN,
    },
  ]
}

export default function useAelinDealsSponsored(variables: DealSponsoredsQueryVariables) {
  const {
    data = [],
    error,
    isValidating,
    mutate,
    setSize: setPage,
    size: currentPage,
  } = useSWRInfinite((...args) => getSwrKey(...args, variables), fetcherDealsSponsored, {
    revalidateFirstPage: true,
    revalidateOnMount: true,
    revalidateOnFocus: true,
  })

  const hasMore = !error && data[data.length - 1]?.length !== 0

  const nextPage = useCallback(() => {
    setPage(currentPage + 1)
  }, [setPage, currentPage])

  const paginatedResult = data?.reduce(
    (allResults, pageResults) => [...allResults, ...pageResults],
    [],
  )

  return {
    data: paginatedResult,
    error,
    nextPage,
    currentPage,
    hasMore,
    isValidating,
    mutate,
  }
}
