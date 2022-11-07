import { useCallback } from 'react'

import orderBy from 'lodash/orderBy'
import useSWRInfinite from 'swr/infinite'

import { DealAccepted_OrderBy, DealAcceptedsQueryVariables, PoolCreated } from '@/graphql-schema'
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

export const getParsedDealAcceptedsHistory = ({
  chainId,
  dealTokenAmount,
  investmentAmount,
  pool,
  timestamp,
}: {
  chainId: ChainsValues
  dealTokenAmount: any
  investmentAmount: any
  pool: {
    id: string
    name: string
    purchaseTokenDecimals?: number | null
    purchaseTokenSymbol: string
    deal?: { underlyingDealTokenDecimals: number; underlyingDealTokenSymbol: string } | null
    upfrontDeal?: { underlyingDealTokenDecimals: number; underlyingDealTokenSymbol: string } | null
  }
  timestamp: any
}) => {
  return {
    id: pool.id,
    network: chainId,
    poolName: parsePoolName(pool.name),
    timestamp: new Date(timestamp * 1000),
    investmentAmount: `${formatToken(investmentAmount, pool.purchaseTokenDecimals || 0, 10)} ${
      pool.purchaseTokenSymbol
    }`,
    dealTokenAmount: `${formatToken(
      dealTokenAmount,
      pool.deal?.underlyingDealTokenDecimals || pool.upfrontDeal?.underlyingDealTokenDecimals || 0,
      10,
    )} ${pool.deal?.underlyingDealTokenSymbol || pool.upfrontDeal?.underlyingDealTokenSymbol}`,
  }
}

export async function fetcherDealsAccepted(variables: DealAcceptedsQueryVariables) {
  const allSDK = getAllGqlSDK()

  const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const queryPromises = (): Promise<any>[] =>
    chainIds.map((chainId: ChainsValues) =>
      allSDK[chainId][DEALS_ACCEPTED_QUERY_NAME](variables)
        .then((res) => {
          return res.dealAccepteds.map(({ dealTokenAmount, investmentAmount, pool, timestamp }) =>
            getParsedDealAcceptedsHistory({
              chainId,
              dealTokenAmount,
              investmentAmount,
              pool,
              timestamp,
            }),
          )
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
