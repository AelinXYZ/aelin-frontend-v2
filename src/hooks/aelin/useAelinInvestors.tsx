import { useCallback } from 'react'

import orderBy from 'lodash/orderBy'
import useSWRInfinite from 'swr/infinite'

import {
  Investor,
  Investor_OrderBy,
  InvestorsQueryVariables,
  QueryInvestorsArgs,
} from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { INVESTORS_RESULTS_PER_CHAIN } from '@/src/constants/pool'
import { INVESTORS_QUERY_NAME } from '@/src/queries/pools/investors'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isSuccessful } from '@/src/utils/isSuccessful'

export async function fetcherUsers(variables: QueryInvestorsArgs) {
  const allSDK = getAllGqlSDK()

  const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const queryPromises = (): Promise<any>[] =>
    chainIds.map((chainId: ChainsValues) =>
      allSDK[chainId][INVESTORS_QUERY_NAME](variables)
        .then((res) => res.investors)
        .catch((err) => {
          console.error(`fetch investors on chain ${chainId} was failed`, err)
          return []
        }),
    )

  try {
    const investorResponses = await Promise.allSettled(queryPromises())

    let result = investorResponses
      .filter(isSuccessful)
      .reduce((resultAcc: Investor[], { value }) => [...resultAcc, ...value], [])

    result = orderBy(
      result,
      variables.orderBy as Investor_OrderBy,
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
  previousPageData: Investor[],
  variables: InvestorsQueryVariables,
) => {
  return [
    {
      ...variables,
      skip: currentPage * INVESTORS_RESULTS_PER_CHAIN,
      first: INVESTORS_RESULTS_PER_CHAIN,
    },
  ]
}

export default function useAelinInvestors(variables: InvestorsQueryVariables) {
  const {
    data = [],
    error,
    isValidating,
    mutate,
    setSize: setPage,
    size: currentPage,
  } = useSWRInfinite((...args) => getSwrKey(...args, variables), fetcherUsers, {
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
