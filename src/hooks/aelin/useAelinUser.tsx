import orderBy from 'lodash/orderBy'
import useSWR from 'swr'

import { DealAccepted, PoolCreated } from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/config/chains'
import { USER_BY_ID_QUERY_NAME } from '@/src/queries/pools/user'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'

export type ParsedUser = {
  poolAddresses: string[]
  poolsInvested: PoolCreated[]
  poolsAsHolder: PoolCreated[]
  poolsSponsored: PoolCreated[]
  dealsAccepted: DealAccepted[]
}

function isSuccessful<T>(response: PromiseSettledResult<T>): response is PromiseFulfilledResult<T> {
  return 'value' in response
}

export async function fetcherUser(userAddress: string): Promise<ParsedUser | undefined> {
  const allSDK = getAllGqlSDK()

  const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const queryPromises = (): Promise<any>[] =>
    chainIds.map((chainId: ChainsValues) =>
      allSDK[chainId][USER_BY_ID_QUERY_NAME]({ userAddress })
        .then((res) => {
          const { user } = res
          if (!user) {
            return {
              poolAddresses: [],
              poolsInvested: [],
              poolsAsHolder: [],
              poolsSponsored: [],
              dealsAccepted: [],
            }
          }

          const poolAddresses = [
            user.poolsInvested.map((pool) => pool.id),
            user.poolsAsHolder.map((pool) => pool.id),
            user.poolsSponsored.map((pool) => pool.id),
            user.dealsAccepted.map((dealAccepted) => dealAccepted.pool.id),
          ].reduce((acc, curVal) => {
            return acc.concat(curVal)
          }, [])

          return {
            poolAddresses,
            poolsInvested: user.poolsInvested,
            poolsAsHolder: user.poolsAsHolder,
            poolsSponsored: user.poolsSponsored,
            dealsAccepted: user.dealsAccepted,
          }
        })
        .catch((err) => {
          console.error(`fetch user on chain ${chainId} was failed`, err)

          return {
            poolAddresses: [],
            poolsInvested: [],
            poolsAsHolder: [],
            poolsSponsored: [],
            dealsAccepted: [],
          }
        }),
    )

  try {
    const userByChainResponses = await Promise.allSettled(queryPromises())
    const result = userByChainResponses.filter(isSuccessful).reduce(
      (resultAcc: ParsedUser, { value }) => {
        return {
          poolAddresses: [...resultAcc.poolAddresses, ...value.poolAddresses],
          poolsInvested: orderBy(
            [...resultAcc.poolsInvested, ...value.poolsInvested],
            ['timestamp'],
            ['desc'],
          ),
          poolsSponsored: orderBy(
            [...resultAcc.poolsSponsored, ...value.poolsSponsored],
            ['timestamp'],
            ['desc'],
          ),
          poolsAsHolder: orderBy(
            [...resultAcc.poolsAsHolder, ...value.poolsAsHolder],
            ['timestamp'],
            ['desc'],
          ),
          dealsAccepted: [...resultAcc.dealsAccepted, ...value.dealsAccepted],
        }
      },
      {
        poolAddresses: [],
        poolsInvested: [],
        poolsAsHolder: [],
        poolsSponsored: [],
        dealsAccepted: [],
      },
    )

    return result
  } catch (e) {
    return
  }
}

export default function useAelinUser(userAddress: string | null) {
  return useSWR(userAddress?.toLocaleLowerCase(), fetcherUser)
}
