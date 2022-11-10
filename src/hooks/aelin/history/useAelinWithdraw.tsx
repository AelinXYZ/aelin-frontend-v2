import { useCallback } from 'react'

import orderBy from 'lodash/orderBy'
import useSWRInfinite from 'swr/infinite'

import { Withdraw_OrderBy, WithdrawsQueryVariables } from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { BASE_DECIMALS, DISPLAY_DECIMALS } from '@/src/constants/misc'
import { HISTORY_RESULTS_PER_CHAIN } from '@/src/constants/pool'
import { WITHDRAWS_QUERY_NAME } from '@/src/queries/history/withdraws'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isSuccessful } from '@/src/utils/isSuccessful'
import { parsePoolName } from '@/src/utils/parsePoolName'
import { formatToken } from '@/src/web3/bigNumber'

export type ParsedWithdrawsHistory = {
  id: string
  poolName: string
  network: ChainsValues
  timestamp: Date
  amountWithdrawn: string
}

export async function fetcherWithdraws(variables: WithdrawsQueryVariables) {
  const allSDK = getAllGqlSDK()

  const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const queryPromises = (): Promise<any>[] =>
    chainIds.map((chainId: ChainsValues) =>
      allSDK[chainId][WITHDRAWS_QUERY_NAME](variables)
        .then((res) => {
          return res.withdraws.map((withdraw) => {
            const amountWithdrawn = formatToken(
              withdraw.amountWithdrawn,
              withdraw.pool.purchaseTokenDecimals || BASE_DECIMALS,
              DISPLAY_DECIMALS,
            )

            return {
              id: withdraw.pool.id,
              network: chainId,
              timestamp: new Date(withdraw.timestamp * 1000),
              amountWithdrawn: `${amountWithdrawn} ${withdraw.pool.purchaseTokenSymbol}`,
              poolName: parsePoolName(withdraw.pool.name),
            }
          })
        })
        .catch((err) => {
          console.error(`fetch withdraw on chain ${chainId} was failed`, err)
          return []
        }),
    )

  try {
    const WithdrawByChainResponses = await Promise.allSettled(queryPromises())

    let result = WithdrawByChainResponses.filter(isSuccessful).reduce(
      (resultAcc: ParsedWithdrawsHistory[], { value }) => [...resultAcc, ...value],
      [],
    )

    result = orderBy(
      result,
      variables.orderBy as Withdraw_OrderBy,
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
  previousPageData: ParsedWithdrawsHistory[],
  variables: WithdrawsQueryVariables,
) => {
  return [
    {
      ...variables,
      skip: currentPage * HISTORY_RESULTS_PER_CHAIN,
      first: HISTORY_RESULTS_PER_CHAIN,
    },
  ]
}

export default function useAelinWithdraw(variables: WithdrawsQueryVariables) {
  const {
    data = [],
    error,
    isValidating,
    mutate,
    setSize: setPage,
    size: currentPage,
  } = useSWRInfinite((...args) => getSwrKey(...args, variables), fetcherWithdraws, {
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
