import { useCallback } from 'react'

import orderBy from 'lodash/orderBy'
import useSWRInfinite from 'swr/infinite'

import { User_OrderBy, UsersQueryVariables } from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { SPONSORS_RESULTS_PER_CHAIN } from '@/src/constants/pool'
import { USERS_QUERY_NAME } from '@/src/queries/pools/users'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isHiddenPool, isTestPool } from '@/src/utils/isHiddenPool'
import isProd from '@/src/utils/isProd'
import { isSuccessful } from '@/src/utils/isSuccessful'

export interface ParsedUserAmt {
  id: string
  chainId: ChainsValues
  poolsInvestedAmt: number
  poolsVouchedAmt: number
  poolsAsHolderAmt: number
  poolsSponsoredAmt: number
  dealsAcceptedAmt: number
}

export async function fetcherUsers(variables: UsersQueryVariables) {
  const allSDK = getAllGqlSDK()

  const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const queryPromises = (): Promise<any>[] =>
    chainIds.map((chainId: ChainsValues) =>
      allSDK[chainId][USERS_QUERY_NAME](variables)
        .then((res) =>
          res.users.map((user) => {
            return {
              id: user.id,
              chainId,
              poolsInvestedAmt: user.poolsInvestedAmt,
              poolsVouchedAmt: user.poolsVouchedAmt,
              poolsAsHolderAmt: user.poolsAsHolderAmt,
              poolsSponsoredAmt: user.poolsSponsored.filter((pool) => {
                if (isTestPool(pool.name) && isProd) return false
                if (isHiddenPool(pool.id)) return false
                return true
              }).length,
              dealsAcceptedAmt: user.dealsAcceptedAmt,
            }
          }),
        )
        .catch((err) => {
          console.error(`fetch sponsors on chain ${chainId} was failed`, err)
          return []
        }),
    )

  try {
    const usersResponses = await Promise.allSettled(queryPromises())

    let result = usersResponses
      .filter(isSuccessful)
      .reduce((resultAcc: ParsedUserAmt[], { value }) => [...resultAcc, ...value], [])

    result = orderBy(
      result,
      variables.orderBy as User_OrderBy,
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
  previousPageData: ParsedUserAmt[],
  variables: UsersQueryVariables,
) => {
  return [
    {
      ...variables,
      skip: currentPage * SPONSORS_RESULTS_PER_CHAIN,
      first: SPONSORS_RESULTS_PER_CHAIN,
    },
  ]
}

export enum UserType {
  Investor = 'Investor',
  Sponsor = 'Sponsor',
  Holder = 'Holder',
}

export default function useAelinUsers(variables: UsersQueryVariables) {
  const {
    data = [],
    error,
    isValidating,
    mutate,
    setSize: setPage,
    size: currentPage,
  } = useSWRInfinite((...args) => getSwrKey(...args, variables), fetcherUsers, {
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
