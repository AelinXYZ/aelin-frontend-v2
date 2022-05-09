import { useCallback } from 'react'

import orderBy from 'lodash/orderBy'
import useSWRInfinite from 'swr/infinite'

import { Deposit_OrderBy, DepositsQueryVariables } from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { HISTORY_RESULTS_PER_CHAIN } from '@/src/constants/pool'
import { DEPOSITS_QUERY_NAME } from '@/src/queries/history/deposits'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isSuccessful } from '@/src/utils/isSuccessful'
import { parsePoolName } from '@/src/utils/parsePoolName'
import { formatToken } from '@/src/web3/bigNumber'

export type ParsedDepositsHistory = {
  id: string
  poolName: string
  network: ChainsValues
  timestamp: Date
  amountDeposited: string
  sponsor: string
}

export async function fetcherDeposits(variables: DepositsQueryVariables) {
  const allSDK = getAllGqlSDK()

  const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const queryPromises = (): Promise<any>[] =>
    chainIds.map((chainId: ChainsValues) =>
      allSDK[chainId][DEPOSITS_QUERY_NAME](variables)
        .then((res) => {
          return res.deposits.map((deposit) => {
            const amountDeposited = formatToken(
              deposit.amountDeposited,
              deposit.pool.purchaseTokenDecimals || 0,
            )

            return {
              id: deposit.pool.id,
              network: chainId,
              sponsor: deposit.pool.sponsor,
              poolName: parsePoolName(deposit.pool.name),
              timestamp: new Date(deposit.timestamp * 1000),
              amountDeposited: `${amountDeposited} ${deposit.pool.purchaseTokenSymbol}`,
            }
          })
        })
        .catch((e) => {
          console.error(`fetch deposits on chain ${chainId} was failed`, e)
          return []
        }),
    )

  try {
    const depositsByChainResponses = await Promise.allSettled(queryPromises())

    let result = depositsByChainResponses
      .filter(isSuccessful)
      .reduce((resultAcc: ParsedDepositsHistory[], { value }) => [...resultAcc, ...value], [])

    result = orderBy(
      result,
      variables.orderBy as Deposit_OrderBy,
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
  previousPageData: ParsedDepositsHistory[],
  variables: DepositsQueryVariables,
) => {
  return [
    {
      ...variables,
      skip: currentPage * HISTORY_RESULTS_PER_CHAIN,
      first: HISTORY_RESULTS_PER_CHAIN,
    },
  ]
}

export default function useAelinDeposits(variables: DepositsQueryVariables) {
  const {
    data = [],
    error,
    isValidating,
    mutate,
    setSize: setPage,
    size: currentPage,
  } = useSWRInfinite((...args) => getSwrKey(...args, variables), fetcherDeposits, {
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
