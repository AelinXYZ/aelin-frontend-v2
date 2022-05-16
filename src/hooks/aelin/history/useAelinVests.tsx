import { useCallback } from 'react'

import orderBy from 'lodash/orderBy'
import useSWRInfinite from 'swr/infinite'

import { Vest_OrderBy, VestsQueryVariables } from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { HISTORY_RESULTS_PER_CHAIN } from '@/src/constants/pool'
import { VESTS_QUERY_NAME } from '@/src/queries/history/vests'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isSuccessful } from '@/src/utils/isSuccessful'
import { parsePoolName } from '@/src/utils/parsePoolName'
import { formatToken } from '@/src/web3/bigNumber'

export type ParsedVestsHistory = {
  id: string
  poolName: string
  network: ChainsValues
  timestamp: Date
  amountVested: string
}

export async function fetcherVests(variables: VestsQueryVariables) {
  const allSDK = getAllGqlSDK()

  const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const queryPromises = (): Promise<any>[] =>
    chainIds.map((chainId: ChainsValues) =>
      allSDK[chainId][VESTS_QUERY_NAME](variables)
        .then((res) => {
          return res.vests.map((vest) => {
            const amountVested = formatToken(
              vest.amountVested,
              vest.pool.deal?.underlyingDealTokenDecimals || 0,
            )

            return {
              id: vest.pool.id,
              network: chainId,
              poolName: parsePoolName(vest.poolName),
              timestamp: new Date(vest.timestamp * 1000),
              amountVested: `${amountVested} ${vest.pool.deal?.underlyingDealTokenSymbol}`,
            }
          })
        })
        .catch((e) => {
          console.error(`fetch vests on chain ${chainId} was failed`, e)
          return []
        }),
    )

  try {
    const VestsByChainResponses = await Promise.allSettled(queryPromises())

    let result = VestsByChainResponses.filter(isSuccessful).reduce(
      (resultAcc: ParsedVestsHistory[], { value }) => [...resultAcc, ...value],
      [],
    )

    result = orderBy(
      result,
      variables.orderBy as Vest_OrderBy,
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
  previousPageData: ParsedVestsHistory[],
  variables: VestsQueryVariables,
) => {
  return [
    {
      ...variables,
      skip: currentPage * HISTORY_RESULTS_PER_CHAIN,
      first: HISTORY_RESULTS_PER_CHAIN,
    },
  ]
}

export default function useAelinVests(variables: VestsQueryVariables) {
  const {
    data = [],
    error,
    isValidating,
    mutate,
    setSize: setPage,
    size: currentPage,
  } = useSWRInfinite((...args) => getSwrKey(...args, variables), fetcherVests, {
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
