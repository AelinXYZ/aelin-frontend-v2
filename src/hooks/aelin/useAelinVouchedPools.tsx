import { orderBy } from 'lodash'
import useSWR from 'swr'

import { ParsedAelinPool, getParsedPool } from '../aelin/useAelinPool'
import { getPurchaseMinimumAmount } from './useGetPurchaseMinimumAmount'
import { InputMaybe, PoolCreated_OrderBy, PoolsCreatedQueryVariables } from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import { POOLS_CREATED_QUERY_NAME } from '@/src/queries/pools/poolsCreated'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isSuccessful } from '@/src/utils/isSuccessful'

const VOUCHED_POOLS_ENDPOINT = '/data/vouched-pools.json'

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

type Props = Omit<PoolsCreatedQueryVariables, 'where'>

const useAelinVouchedPools = (variables: Props) => {
  return useSWR<ParsedAelinPool[], Error>(
    'vouched-pools',
    async () => {
      const allSDK = getAllGqlSDK()
      const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

      const response = await fetch(VOUCHED_POOLS_ENDPOINT)
      const vouchedPools = await response.json()

      const purchaseMinimumAmounts = await getPurchaseMinimumAmount()

      const queryPromises = (): Promise<any>[] =>
        chainIds.map(async (chainId: ChainsValues) => {
          try {
            if (!vouchedPools[chainId]) return []

            const { poolCreateds } = await allSDK[chainId][POOLS_CREATED_QUERY_NAME]({
              ...variables,
              where: {
                id_in: [...vouchedPools[chainId]],
              },
            })

            return poolCreateds.map((pool) => {
              const purchaseMinimumAmount = purchaseMinimumAmounts[chainId][pool.id] ?? ZERO_BN

              return getParsedPool({
                chainId,
                pool,
                poolAddress: pool.id,
                purchaseTokenDecimals: pool?.purchaseTokenDecimals as number,
                purchaseMinimumAmount,
              })
            })
          } catch (err) {
            console.error(`fetch pools created on chain ${chainId} was failed`, err)
            return []
          }
        })

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

        return result
      } catch (err) {
        console.error(err)
        return []
      }
    },
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
    },
  )
}

export default useAelinVouchedPools
