import { useCallback } from 'react'

import orderBy from 'lodash/orderBy'
import useSWRInfinite from 'swr/infinite'

import { DealFunded_OrderBy, DealFundedsQueryVariables } from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { HISTORY_RESULTS_PER_CHAIN } from '@/src/constants/pool'
import { DEALS_FUNDED_QUERY_NAME } from '@/src/queries/history/dealsFunded'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isSuccessful } from '@/src/utils/isSuccessful'
import { parsePoolName } from '@/src/utils/parsePoolName'
import { formatToken } from '@/src/web3/bigNumber'

export type ParsedDealFundedsHistory = {
  id: string
  poolName: string
  network: ChainsValues
  timestamp: Date
  amountFunded: string
  amountRaised: string
}

export async function fetcherDealsFunded(variables: DealFundedsQueryVariables) {
  const allSDK = getAllGqlSDK()

  const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const queryPromises = (): Promise<any>[] =>
    chainIds.map((chainId: ChainsValues) =>
      allSDK[chainId][DEALS_FUNDED_QUERY_NAME](variables)
        .then((res) => {
          return res.dealFundeds.map((dealFunded) => {
            const amountFunded = formatToken(
              dealFunded.amountFunded,
              dealFunded.pool.deal?.underlyingDealTokenDecimals || 0,
            )

            const amountRaised = formatToken(
              dealFunded.amountRaised,
              dealFunded.pool.purchaseTokenDecimals || 0,
            )

            return {
              id: dealFunded.pool.id,
              network: chainId,
              poolName: parsePoolName(dealFunded.pool.name),
              timestamp: new Date(dealFunded.timestamp * 1000),
              amountFunded: `${amountFunded} ${dealFunded.pool.deal?.underlyingDealTokenSymbol}`,
              amountRaised: `${amountRaised} ${dealFunded.pool.purchaseTokenSymbol}`,
            }
          })
        })
        .catch((e) => {
          console.error(`fetch deals funded on chain ${chainId} was failed`, e)
          return []
        }),
    )

  try {
    const dealFundedsByChainResponses = await Promise.allSettled(queryPromises())

    let result = dealFundedsByChainResponses
      .filter(isSuccessful)
      .reduce((resultAcc: ParsedDealFundedsHistory[], { value }) => [...resultAcc, ...value], [])

    result = orderBy(
      result,
      variables.orderBy as DealFunded_OrderBy,
      variables.orderDirection ? [variables.orderDirection] : ['desc'],
    )

    return result
  } catch (e) {
    console.error(e)
    return []
  }
}

const getSwrKey = (
  currentPage: number,
  previousPageData: ParsedDealFundedsHistory[],
  variables: DealFundedsQueryVariables,
) => {
  return [
    {
      ...variables,
      skip: currentPage * HISTORY_RESULTS_PER_CHAIN,
      first: HISTORY_RESULTS_PER_CHAIN,
    },
  ]
}

export default function useAelinDealsAccepted(variables: DealFundedsQueryVariables) {
  const {
    data = [],
    error,
    isValidating,
    mutate,
    setSize: setPage,
    size: currentPage,
  } = useSWRInfinite((...args) => getSwrKey(...args, variables), fetcherDealsFunded, {
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
