import { useCallback } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import orderBy from 'lodash/orderBy'
import useSWRInfinite from 'swr/infinite'

import { Deposit, User_OrderBy, UsersQueryVariables } from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { BASE_DECIMALS, DISPLAY_DECIMALS } from '@/src/constants/misc'
import { SPONSORS_RESULTS_PER_CHAIN } from '@/src/constants/pool'
import { USERS_QUERY_NAME } from '@/src/queries/pools/users'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isSuccessful } from '@/src/utils/isSuccessful'
import { formatToken } from '@/src/web3/bigNumber'

export interface RawDeposit {
  amountDeposited: string
  pool: {
    id: string
    purchaseTokenDecimals?: number | null
    purchaseTokenSymbol: string
  }
}

export interface Deposits {
  [poolAddress: string]: {
    deposits: {
      raw: BigNumber
      formatted: string | undefined
    }[]
    purchaseTokenSymbol: string
  }
}

export interface ParsedUserAmt {
  id: string
  chainId: ChainsValues
  poolsInvestedAmt: number
  poolsVouchedAmt: number
  poolsAsHolderAmt: number
  poolsSponsoredAmt: number
  dealsAcceptedAmt: number
  history: {
    deposits: Deposits
  }
}

const formatDeposits = (deposits: RawDeposit[]): Deposits => {
  return deposits.reduce((parsedDeposits: Deposits, rawDeposit: RawDeposit) => {
    const formattedDeposit = {
      raw: BigNumber.from(rawDeposit.amountDeposited),
      formatted: formatToken(
        rawDeposit.amountDeposited,
        rawDeposit.pool.purchaseTokenDecimals || BASE_DECIMALS,
        DISPLAY_DECIMALS,
      ),
    }

    const poolDeposits = parsedDeposits[rawDeposit.pool.id]?.deposits || []
    const deposit = {
      deposits: [...poolDeposits, formattedDeposit],
      purchaseTokenSymbol: rawDeposit.pool.purchaseTokenSymbol,
    }

    return {
      ...parsedDeposits,
      [rawDeposit.pool.id]: deposit,
    }
  }, {})
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
              poolsSponsoredAmt: user.poolsSponsoredAmt,
              dealsAcceptedAmt: user.dealsAcceptedAmt,
              history: {
                deposits: formatDeposits(user.history?.deposits || []),
              },
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

export default function useAelinUsers(variables: UsersQueryVariables, suspense = true) {
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
    suspense,
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
