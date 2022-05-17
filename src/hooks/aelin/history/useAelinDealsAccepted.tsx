import { useCallback } from 'react'

import orderBy from 'lodash/orderBy'
import useSWRInfinite from 'swr/infinite'

import { DealAccepted_OrderBy, DealAcceptedsQueryVariables } from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { HISTORY_RESULTS_PER_CHAIN } from '@/src/constants/pool'
import { DEALS_ACCEPTED_QUERY_NAME } from '@/src/queries/history/dealsAccepted'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isSuccessful } from '@/src/utils/isSuccessful'
import { parsePoolName } from '@/src/utils/parsePoolName'
import { formatToken } from '@/src/web3/bigNumber'

export type ParsedDealAcceptedsHistory = {
  id: string
  poolName: string
  network: ChainsValues
  timestamp: Date
  investmentAmount: string
  dealTokenAmount: string
}

export async function fetcherDealsAccepted(variables: DealAcceptedsQueryVariables) {
  const allSDK = getAllGqlSDK()

  const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const queryPromises = (): Promise<any>[] =>
    chainIds.map((chainId: ChainsValues) =>
      allSDK[chainId][DEALS_ACCEPTED_QUERY_NAME](variables)
        .then((res) => {
          return res.dealAccepteds.map((dealAccepted) => {
            const investmentAmount = formatToken(
              dealAccepted.investmentAmount,
              dealAccepted.pool.purchaseTokenDecimals || 0,
            )

            const dealTokenAmount = formatToken(
              dealAccepted.dealTokenAmount,
              dealAccepted.pool.deal?.underlyingDealTokenDecimals || 0,
            )

            return {
              id: dealAccepted.pool.id,
              network: chainId,
              poolName: parsePoolName(dealAccepted.pool.name),
              timestamp: new Date(dealAccepted.timestamp * 1000),
              investmentAmount: `${investmentAmount} ${dealAccepted.pool.purchaseTokenSymbol}`,
              dealTokenAmount: `${dealTokenAmount} ${dealAccepted.pool.deal?.underlyingDealTokenSymbol}`,
            }
          })
        })
        .catch((err) => {
          console.error(`fetch deals accepted on chain ${chainId} was failed`, err)
          return []
        }),
    )

  try {
    const dealAcceptedsByChainResponses = await Promise.allSettled(queryPromises())

    let result = dealAcceptedsByChainResponses
      .filter(isSuccessful)
      .reduce((resultAcc: ParsedDealAcceptedsHistory[], { value }) => [...resultAcc, ...value], [])

    result = orderBy(
      result,
      variables.orderBy as DealAccepted_OrderBy,
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
  previousPageData: ParsedDealAcceptedsHistory[],
  variables: DealAcceptedsQueryVariables,
) => {
  return [
    {
      ...variables,
      skip: currentPage * HISTORY_RESULTS_PER_CHAIN,
      first: HISTORY_RESULTS_PER_CHAIN,
    },
  ]
}

export default function useAelinDealsAccepted(variables: DealAcceptedsQueryVariables) {
  const {
    data = [],
    error,
    isValidating,
    mutate,
    setSize: setPage,
    size: currentPage,
  } = useSWRInfinite((...args) => getSwrKey(...args, variables), fetcherDealsAccepted, {
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
