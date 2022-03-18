import * as Dom from 'graphql-request/dist/types.dom'
import { forEach } from 'iterall'
import useSWR from 'swr'

import { PoolCreated, PoolsCreatedQuery, PoolsCreatedQueryVariables } from '@/graphql-schema'
import { ChainsValues } from '@/src/constants/chains'
import { POOLS_CREATED_QUERY_NAME } from '@/src/queries/pools/poolsCreated'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import swrKeyGenerator from '@/src/utils/swrKeyGenerator'

interface PoolCreatedWithChainId extends PoolCreated {
  chainId: number
}

const pushChainId = (poolsArray: Array<PoolCreated>, chainId: number): PoolCreatedWithChainId[] =>
  poolsArray.map((pool) => ({ ...pool, chainId }))

const parsePools = (pools: PoolsCreatedQuery[], chains: string[]) =>
  pools.reduce(
    (
      resultAcc: Array<PoolCreatedWithChainId>,
      currentResult: PoolsCreatedQuery,
      currentIndex: number,
    ) => {
      const chainPools = Object.values(currentResult).shift() as Array<PoolCreated>
      const chainPoolsWithNetworkId = pushChainId(chainPools, Number(chains[currentIndex]))

      resultAcc = [...resultAcc, ...chainPoolsWithNetworkId]

      return resultAcc
    },
    [],
  )

export default function useAelinPools(
  variables?: PoolsCreatedQueryVariables,
  requestHeaders?: Dom.RequestInit['headers'],
) {
  const allSDK = getAllGqlSDK()
  const availableChains = Object.keys(allSDK)

  const { data, error } = useSWR(
    [
      swrKeyGenerator<PoolsCreatedQueryVariables>('PoolsCreatedAllChains', variables),
      availableChains,
    ],
    async () => {
      const queriesPromises: Promise<PoolsCreatedQuery>[] = []

      forEach(availableChains, async (chainId: ChainsValues) => {
        const queryToCall = allSDK[chainId][POOLS_CREATED_QUERY_NAME]

        queriesPromises.push(queryToCall(variables, requestHeaders))
      })

      // ChainIds promise array.
      // Each item will have an array of pools and represent the pools of a single chain
      const allPools = await Promise.all(queriesPromises)

      return parsePools(allPools, availableChains)
    },
  )

  return { data, error }
}
