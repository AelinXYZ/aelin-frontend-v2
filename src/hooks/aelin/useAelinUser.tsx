import orderBy from 'lodash/orderBy'
import useSWR, { SWRConfiguration } from 'swr'

import {
  ParsedDealAcceptedsHistory,
  getParsedDealAcceptedsHistory,
} from './history/useAelinDealsAccepted'
import { ParsedAelinPool, getParsedPool } from './useAelinPool'
import { getPurchaseMinimumAmount } from './useGetPurchaseMinimumAmount'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import { USER_BY_ID_QUERY_NAME } from '@/src/queries/pools/user'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'

export type ParsedUser = {
  poolAddresses: string[]
  poolsInvested: ParsedAelinPool[]
  poolsAsHolder: ParsedAelinPool[]
  poolsSponsored: ParsedAelinPool[]
  dealsAccepted: ParsedDealAcceptedsHistory[]
  upfrontDealsAccepted: ParsedAelinPool[]
}

function isSuccessful<T>(response: PromiseSettledResult<T>): response is PromiseFulfilledResult<T> {
  return 'value' in response
}

export async function fetcherUser(userAddress: string): Promise<ParsedUser | undefined> {
  const allSDK = getAllGqlSDK()

  const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const purchaseMinimumAmounts = await getPurchaseMinimumAmount()

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
              upfrontDealsAccepted: [],
            }
          }

          const poolAddresses = [
            user.poolsInvested.map((poolCreated) => poolCreated.id),
            user.poolsAsHolder.map((poolCreated) => poolCreated.id),
            user.poolsSponsored.map((poolCreated) => poolCreated.id),
            user.dealsAccepted.map((dealAccepted) => dealAccepted.pool.id),
            user.upfrontDealsAccepted.map((poolCreated) => poolCreated.id),
          ]
            .reduce((acc, curVal) => {
              return acc.concat(curVal)
            }, [])
            .filter(
              (poolAddress: string, index: number, arr: string[]) =>
                arr.indexOf(poolAddress) === index,
            )

          return {
            poolAddresses,
            poolsInvested: user.poolsInvested.map((pool) =>
              getParsedPool({
                chainId,
                pool,
                poolAddress: pool.id,
                purchaseTokenDecimals: pool?.purchaseTokenDecimals as number,
                purchaseMinimumAmount: purchaseMinimumAmounts[chainId][pool.id],
              }),
            ),
            poolsAsHolder: user.poolsAsHolder.map((pool) =>
              getParsedPool({
                chainId,
                pool,
                poolAddress: pool.id,
                purchaseTokenDecimals: pool?.purchaseTokenDecimals as number,
                purchaseMinimumAmount: purchaseMinimumAmounts[chainId][pool.id],
              }),
            ),
            poolsSponsored: user.poolsSponsored.map((pool) =>
              getParsedPool({
                chainId,
                pool,
                poolAddress: pool.id,
                purchaseTokenDecimals: pool?.purchaseTokenDecimals as number,
                purchaseMinimumAmount: purchaseMinimumAmounts[chainId][pool.id],
              }),
            ),
            dealsAccepted: user.dealsAccepted.map(
              ({ dealTokenAmount, investmentAmount, pool, timestamp }) =>
                getParsedDealAcceptedsHistory({
                  chainId,
                  dealTokenAmount,
                  investmentAmount,
                  pool,
                  timestamp,
                }),
            ),
            upfrontDealsAccepted: user.upfrontDealsAccepted.map((pool) =>
              getParsedPool({
                chainId,
                pool,
                poolAddress: pool.id,
                purchaseTokenDecimals: pool?.purchaseTokenDecimals as number,
                purchaseMinimumAmount: purchaseMinimumAmounts[chainId][pool.id],
              }),
            ),
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
            upfrontDealsAccepted: [],
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
            ['start'],
            ['desc'],
          ),
          poolsSponsored: orderBy(
            [...resultAcc.poolsSponsored, ...value.poolsSponsored],
            ['start'],
            ['desc'],
          ),
          poolsAsHolder: orderBy(
            [...resultAcc.poolsAsHolder, ...value.poolsAsHolder],
            ['start'],
            ['desc'],
          ),
          dealsAccepted: [...resultAcc.dealsAccepted, ...value.dealsAccepted],
          upfrontDealsAccepted: orderBy(
            [...resultAcc.upfrontDealsAccepted, ...value.upfrontDealsAccepted],
            ['start'],
            ['desc'],
          ),
        }
      },
      {
        poolAddresses: [],
        poolsInvested: [],
        poolsAsHolder: [],
        poolsSponsored: [],
        dealsAccepted: [],
        upfrontDealsAccepted: [],
      },
    )

    return result
  } catch (e) {
    return
  }
}

export default function useAelinUser(userAddress: string | null, config?: SWRConfiguration) {
  return useSWR(userAddress?.toLocaleLowerCase(), fetcherUser, {
    ...config,

    // NOTE: Seems like SWR have some bug in default stable-hash comparison for complex objects causing extra rerendering.
    compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  })
}
