import { useCallback } from 'react'

import orderBy from 'lodash/orderBy'
import useSWRInfinite from 'swr/infinite'

import {
  InputMaybe,
  PoolCreated_OrderBy,
  PoolStatus,
  PoolsCreatedQueryVariables,
} from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import { ExtendedStatus, POOLS_RESULTS_PER_CHAIN, allStages } from '@/src/constants/pool'
import { ParsedAelinPool, getParsedPool } from '@/src/hooks/aelin/useAelinPool'
import { POOLS_CREATED_QUERY_NAME } from '@/src/queries/pools/poolsCreated'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'

export interface PoolParsedWithState extends ParsedAelinPool {
  stage: ExtendedStatus
}

function isSuccessful<T>(response: PromiseSettledResult<T>): response is PromiseFulfilledResult<T> {
  return 'value' in response
}

export const calculateStatus = ({
  poolStatus,
  purchaseExpiry,
}: {
  poolStatus: PoolStatus
  purchaseExpiry: number
}): ExtendedStatus => {
  const now = Date.now()
  if (poolStatus === PoolStatus.PoolOpen && now > purchaseExpiry) {
    return allStages.SeekingDeal
  }
  return poolStatus
}

const getLocalKeySort = (orderBy: InputMaybe<PoolCreated_OrderBy> | undefined) => {
  switch (orderBy) {
    case PoolCreated_OrderBy.Name:
    case PoolCreated_OrderBy.PoolStatus:
    case PoolCreated_OrderBy.Sponsor:
      return orderBy
    case PoolCreated_OrderBy.Timestamp:
      return 'start'
    case PoolCreated_OrderBy.TotalSupply:
      return 'amountInPool'
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

  // Inject chainId in each pool when promise resolve
  const queryPromises = (): Promise<any>[] =>
    networks.map((chainId: ChainsValues) =>
      allSDK[chainId][POOLS_CREATED_QUERY_NAME](variables)
        .then((res) =>
          res.poolCreateds.map((pool) => {
            const parsedPool = getParsedPool({
              chainId,
              poolAddress: pool.id,
              pool,
              purchaseTokenDecimals: pool?.purchaseTokenDecimals as number,
              poolTotalWithdrawn: ZERO_BN,
            })
            return {
              ...parsedPool,
              stage: calculateStatus({
                poolStatus: parsedPool.poolStatus,
                purchaseExpiry: pool.purchaseExpiry,
              }),
            }
          }),
        )
        .catch((e) => {
          console.error(`fetch pools on chain ${chainId} was failed`, e)
          return []
        }),
    )

  // ChainIds promise array.
  // Each item will have an array of pools of a single chain
  try {
    const poolsByChainResponses = await Promise.allSettled(queryPromises())

    let result = poolsByChainResponses
      .filter(isSuccessful)
      .reduce((resultAcc: PoolParsedWithState[], { value }) => [...resultAcc, ...value], [])

    result = orderBy(
      result,
      [getLocalKeySort(variables.orderBy)],
      variables.orderDirection ? [variables.orderDirection] : ['desc'],
    )

    // Return Merged all pools by chain in unique array. Only success promises
    // & Sorting by timestamp
    return result
  } catch (e) {
    console.error(e)
    return []
  }
}

const getSwrKey = (
  currentPage: number,
  previousPageData: PoolParsedWithState[],
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
  } = useSWRInfinite((...args) => getSwrKey(...args, variables, network), fetcherPools, {
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
