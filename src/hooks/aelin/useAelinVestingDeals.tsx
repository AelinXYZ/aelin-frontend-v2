import { useCallback } from 'react'

import orderBy from 'lodash/orderBy'
import useSWRInfinite from 'swr/infinite'

import { VestingDeal_OrderBy, VestingDealsQueryVariables } from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { VESTING_DEALS_RESULTS_PER_CHAIN } from '@/src/constants/pool'
import { VESTING_DEALS_QUERY_NAME } from '@/src/queries/pools/vestingDeals'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { formatToken } from '@/src/web3/bigNumber'

export type ParsedVestingDeal = {
  poolName: string
  poolAddress: string
  tokenToVest: string
  myDealTotal: string
  amountToVest: string
  totalVested: string
  vestingPeriodEnds: Date
  vestingPeriodStarts: Date
  chainId: ChainsValues
}

function isSuccessful<T>(response: PromiseSettledResult<T>): response is PromiseFulfilledResult<T> {
  return 'value' in response
}

function parsePoolName(name: string) {
  return name.slice(name.indexOf('-') + 1)
}

export async function fetcherVestingDeals(variables: VestingDealsQueryVariables) {
  const allSDK = getAllGqlSDK()

  const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const queryPromises = (): Promise<any>[] =>
    chainIds.map((chainId: ChainsValues) =>
      allSDK[chainId][VESTING_DEALS_QUERY_NAME](variables)
        .then((res) =>
          res.vestingDeals.map((vestingDeal) => ({
            poolName: parsePoolName(vestingDeal.poolName),
            tokenToVest: vestingDeal.tokenToVestSymbol,
            myDealTotal: formatToken(
              vestingDeal.investorDealTotal,
              vestingDeal.underlyingDealTokenDecimals || 0,
            ),
            amountToVest: formatToken(
              vestingDeal.amountToVest,
              vestingDeal.underlyingDealTokenDecimals || 0,
            ),
            totalVested: formatToken(
              vestingDeal.totalVested,
              vestingDeal.underlyingDealTokenDecimals || 0,
            ),
            vestingPeriodEnds: vestingDeal.vestingPeriodEnds,
            vestingPeriodStarts: vestingDeal.vestingPeriodStarts,
            poolAddress: vestingDeal.poolAddress,
            chainId,
          })),
        )
        .catch((e) => {
          console.error(`fetch vestingDeals on chain ${chainId} was failed`, e)
          return []
        }),
    )

  try {
    const vestingDealsByChainResponses = await Promise.allSettled(queryPromises())

    let result = vestingDealsByChainResponses
      .filter(isSuccessful)
      .reduce((resultAcc: ParsedVestingDeal[], { value }) => [...resultAcc, ...value], [])

    result = orderBy(
      result,
      variables.orderBy as VestingDeal_OrderBy,
      variables.orderDirection ? [variables.orderDirection] : ['desc'],
    )

    return result
  } catch (e) {
    console.error(e)
    return []
  }
}

const getSwrKey = (
  currentPage: number,
  previousPageData: ParsedVestingDeal[],
  variables: VestingDealsQueryVariables,
) => {
  return [
    {
      ...variables,
      skip: currentPage * VESTING_DEALS_RESULTS_PER_CHAIN,
      first: VESTING_DEALS_RESULTS_PER_CHAIN,
    },
  ]
}

export default function useAelinVestingDeals(variables: VestingDealsQueryVariables) {
  const {
    data = [],
    error,
    isValidating,
    mutate,
    setSize: setPage,
    size: currentPage,
  } = useSWRInfinite((...args) => getSwrKey(...args, variables), fetcherVestingDeals, {
    revalidateFirstPage: true,
    revalidateOnMount: true,
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
