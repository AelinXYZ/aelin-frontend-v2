import { useCallback } from 'react'

import orderBy from 'lodash/orderBy'
import useSWRInfinite from 'swr/infinite'

import { ensResolver } from '../useEnsResolvers'
import { InputMaybe, PoolCreated_OrderBy, PoolsCreatedQueryVariables } from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { POOLS_RESULTS_PER_CHAIN } from '@/src/constants/pool'
import { ParsedAelinPool, getParsedPool } from '@/src/hooks/aelin/useAelinPool'
import { POOLS_CREATED_QUERY_NAME } from '@/src/queries/pools/poolsCreated'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isHiddenPool, isTestPool } from '@/src/utils/isHiddenPool'
import isProd from '@/src/utils/isProd'
import { isSuccessful } from '@/src/utils/isSuccessful'

const getLocalKeySort = (orderBy: InputMaybe<PoolCreated_OrderBy> | undefined) => {
  switch (orderBy) {
    case PoolCreated_OrderBy.Name:
    case PoolCreated_OrderBy.PoolStatus:
    case PoolCreated_OrderBy.Sponsor:
      return orderBy
    case PoolCreated_OrderBy.Timestamp:
      return 'start'
    case PoolCreated_OrderBy.TotalAmountFunded:
      return 'funded'
    case PoolCreated_OrderBy.PurchaseExpiry:
      return 'investmentDeadline'
    case PoolCreated_OrderBy.PurchaseToken:
      return 'investmentToken'
    default:
      return PoolCreated_OrderBy.Timestamp
  }
}

export async function fetcherPools(variables: PoolsCreatedQueryVariables, network: ChainsValues) {
  const allSDK = getAllGqlSDK()

  const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const networks = network ? [network] : chainIds

  const _variables = { ...variables }

  if (_variables?.where?.filter_contains) {
    _variables.where.filter_contains = await ensResolver(_variables.where.filter_contains)
  }

  // Inject chainId in each pool when promise resolve
  const queryPromises = (): Promise<any>[] =>
    networks.map(async (chainId: ChainsValues) => {
      try {
        const { poolCreateds } = await allSDK[chainId][POOLS_CREATED_QUERY_NAME](variables)

        return poolCreateds.reduce((accum: ParsedAelinPool[], pool) => {
          if (isTestPool(pool.name) && isProd) return accum
          if (isHiddenPool(pool.id)) return accum

          accum.push(
            getParsedPool({
              chainId,
              pool,
              poolAddress: pool.id,
              purchaseTokenDecimals: pool?.purchaseTokenDecimals as number,
            }),
          )

          return accum
        }, [])
      } catch (err) {
        console.error(`fetch pools created on chain ${chainId} was failed`, err)
        return []
      }
    })

  // ChainIds promise array.
  // Each item will have an array of pools of a single chain
  try {
    const poolsByChainResponses = await Promise.allSettled(queryPromises())

    let result = poolsByChainResponses
      .filter(isSuccessful)
      .reduce((resultAcc: ParsedAelinPool[], { value }) => [...resultAcc, ...value], [])

    result = orderBy(
      result,
      [getLocalKeySort(variables.orderBy)],
      variables.orderDirection ? [variables.orderDirection] : ['desc'],
    )

    // Return Merged all pools by chain in unique array. Only success promises
    // & Sorting by timestamp
    return result
  } catch (err) {
    console.error(err)
    return []
  }
}

const getSwrKey = (
  currentPage: number,
  variables: PoolsCreatedQueryVariables,
  network: ChainsValues | null,
) => {
  return [
    { ...variables, skip: currentPage * POOLS_RESULTS_PER_CHAIN, first: POOLS_RESULTS_PER_CHAIN },
    network,
  ]
}

export default function useAelinPools(
  variables: PoolsCreatedQueryVariables,
  network: ChainsValues | null,
) {
  const {
    data = [],
    error,
    isValidating,
    mutate,
    setSize: setPage,
    size: currentPage,
  } = useSWRInfinite((currentPage) => getSwrKey(currentPage, variables, network), fetcherPools, {
    revalidateFirstPage: true,
    revalidateOnMount: true,
  })

  const hasMore = !error && data[data.length - 1]?.length !== 0

  const nextPage = useCallback(() => {
    setPage(currentPage + 1)
  }, [setPage, currentPage])

  // merge all pages in one array of pools
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
