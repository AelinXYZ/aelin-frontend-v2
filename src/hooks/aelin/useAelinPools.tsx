import { useCallback } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import useSWRInfinite from 'swr/infinite'

import { PoolCreated, PoolsCreatedQueryVariables } from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { POOLS_RESULTS_PER_CHAIN } from '@/src/constants/pool'
import { POOLS_CREATED_QUERY_NAME } from '@/src/queries/pools/poolsCreated'
import { getAmountInPool, getPurchaseExpiry, getStatusText } from '@/src/utils/aelinPool'
import { calculateStatus } from '@/src/utils/calculatePoolStatus'
import { getFormattedDurationFromDateToNow } from '@/src/utils/date'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'

type DetailedNumber = {
  raw: BigNumber
  formatted: string | undefined
}

type ParsedPool = {
  id: string
  name: string
  sponsor: string
  network: ChainsValues
  amountInPool: DetailedNumber
  investmentDeadline: string
  investmentToken: string
  stage: string
  timestamp: number
}

interface PoolCreatedWithChainId extends PoolCreated {
  chainId: ChainsValues
}

function isSuccessful<T>(response: PromiseSettledResult<T>): response is PromiseFulfilledResult<T> {
  return 'value' in response
}

function parsedPool(pool: PoolCreatedWithChainId): ParsedPool {
  return {
    id: pool.id,
    name: pool.name.split('aePool-').pop() as string,
    sponsor: pool.sponsor,
    network: pool.chainId,
    amountInPool: getAmountInPool({
      ...pool,
      purchaseTokenDecimals: pool.purchaseTokenDecimals || 0,
    }),
    investmentDeadline: getFormattedDurationFromDateToNow(getPurchaseExpiry(pool), 'ended'),
    investmentToken: pool.purchaseTokenSymbol,
    stage: getStatusText({ poolStatus: calculateStatus(pool) }),
    timestamp: pool.timestamp,
  }
}

export async function fetcherPools(variables: PoolsCreatedQueryVariables, network: ChainsValues) {
  const allSDK = getAllGqlSDK()

  const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const networks = network ? [network] : chainIds

  // Inject chainId in each pool when promise resolve
  const queryPromises = () =>
    networks.map((chainId: ChainsValues) =>
      allSDK[chainId][POOLS_CREATED_QUERY_NAME](variables)
        .then((res) => res.poolCreateds.map((pool) => parsedPool({ ...pool, chainId })))
        .catch((e) => {
          console.error(`fetch pools on chain ${chainId} was failed`, e)
          return []
        }),
    )

  // ChainIds promise array.
  // Each item will have an array of pools of a single chain
  try {
    const poolsByChainResponses = await Promise.allSettled(queryPromises())

    // Return Merged all pools by chain in unique array. Only success promises
    // & Sorting by timestamp
    return poolsByChainResponses
      .filter(isSuccessful)
      .reduce((resultAcc: ParsedPool[], { value }) => [...resultAcc, ...value], [])
      .sort((pool1, pool2) => pool2.timestamp - pool1.timestamp)
  } catch (e) {
    console.error(e)
    return []
  }
}

const getSwrKey = (
  currentPage: number,
  previousPageData: PoolCreatedWithChainId[],
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

  return { data: paginatedResult, error, nextPage, currentPage, hasMore, isValidating, mutate }
}
