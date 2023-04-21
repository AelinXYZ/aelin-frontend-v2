import { orderBy } from 'lodash'
import useSWR from 'swr'

import { InputMaybe, PoolCreated_OrderBy, PoolsCreatedQueryVariables } from '@/graphql-schema'
import VOUCHED_POOLS_ENDPOINT from '@/public/data/vouched-pools.json'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { ParsedAelinPool, getParsedPool } from '@/src/hooks/aelin/useAelinPool'
import { fetchMinimumPurchaseAmount } from '@/src/hooks/aelin/useGetMinimumPurchaseAmount'
import { POOLS_CREATED_QUERY_NAME } from '@/src/queries/pools/poolsCreated'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isSuccessful } from '@/src/utils/isSuccessful'

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

const useAelinHardCodedVouchedPools = (variables: Props) => {
  return useSWR<ParsedAelinPool[], Error>(
    'vouched-pools',
    async () => {
      const allSDK = getAllGqlSDK()
      const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

      const vouchedPools: any = VOUCHED_POOLS_ENDPOINT

      const purchaseMinimumAmounts: any = await fetchMinimumPurchaseAmount()

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
              const minimumPurchaseAmount = purchaseMinimumAmounts[chainId]?.[pool.id]

              return getParsedPool({
                chainId,
                pool,
                poolAddress: pool.id,
                purchaseTokenDecimals: pool?.purchaseTokenDecimals as number,
                minimumPurchaseAmount,
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

export default useAelinHardCodedVouchedPools
