import useSWRInfinite from 'swr/infinite'

import { PoolCreated, PoolsCreatedQueryVariables } from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { AllSDK } from '@/src/constants/gqlSdkByNetwork'
import { POOLS_RESULTS_PER_CHAIN } from '@/src/constants/pools'
import { POOLS_CREATED_QUERY_NAME } from '@/src/queries/pools/poolsCreated'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'

interface parsedPool {
  name: string
  sponsorName: string
  sponsorUrl: string
  badge: number
  network: ChainsValues
  amount: number
  deadline: Date
  token: string
  status: string
}

interface PoolCreatedWithChainId extends PoolCreated {
  chainId: ChainsValues
}

const pushChainId = (poolsArray: PoolCreated[], chainId: ChainsValues): PoolCreatedWithChainId[] =>
  poolsArray.map((pool) => ({ ...pool, chainId }))

function isSuccessful<T>(response: PromiseSettledResult<T>): response is PromiseFulfilledResult<T> {
  return 'value' in response
}

export async function fetcherPools(allSDK: AllSDK, variables: PoolsCreatedQueryVariables) {
  const chainsIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const queryPromises = chainsIds.map((chainId: ChainsValues) => {
    return allSDK[chainId][POOLS_CREATED_QUERY_NAME](variables)
      .then((res) => {
        return {
          data: res.poolCreateds,
          chainId,
        }
      })
      .catch((e) => {
        console.error(`fetch pools on chain ${chainId} was failed`)
        return {
          data: [],
          chainId,
        }
      })
  })

  // ChainIds promise array.
  // Each item will have an array of pools of a single chain
  try {
    const poolsByChainResponses = await Promise.allSettled(queryPromises)

    // Return Merged all pools by chain in unique array
    return poolsByChainResponses
      .filter(isSuccessful)
      .reduce((resultAcc: PoolCreatedWithChainId[], currentResult) => {
        const {
          value: { chainId, data },
        } = currentResult
        const chainPoolsWithNetworkId = pushChainId(data, chainId)

        resultAcc = [...resultAcc, ...chainPoolsWithNetworkId]

        return resultAcc
      }, [])
      .sort((pool1, pool2) => pool2.timestamp - pool1.timestamp) // sorting result by timestamp
  } catch (e) {
    console.error(e)
    return []
  }
}

const getSwrKey = (
  currentPage: number,
  previousPageData: PoolCreatedWithChainId[],
  allSDK: AllSDK,
  variables: PoolsCreatedQueryVariables,
) => {
  if (previousPageData && !previousPageData.length) return null

  return [
    allSDK,
    { ...variables, skip: currentPage * POOLS_RESULTS_PER_CHAIN, first: POOLS_RESULTS_PER_CHAIN },
  ]
}

export default function useAelinPools(variables: PoolsCreatedQueryVariables) {
  const allSDK = getAllGqlSDK()

  const {
    data = [],
    error,
    isValidating,
    mutate,
    setSize: setPage,
    size: currentPage,
  } = useSWRInfinite((...args) => getSwrKey(...args, allSDK, variables), fetcherPools)

  const hasMore = !error && data[data.length - 1]?.length !== 0

  const paginatedResult = data?.flatMap((page) => page)

  return { data: paginatedResult, error, setPage, currentPage, hasMore, isValidating, mutate }
}
