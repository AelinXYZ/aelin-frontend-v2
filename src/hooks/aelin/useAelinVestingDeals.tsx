import { useCallback } from 'react'

import orderBy from 'lodash/orderBy'
import useSWRInfinite from 'swr/infinite'

import { VestingDeal_OrderBy, VestingDealsQueryVariables } from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { VESTING_DEALS_RESULTS_PER_CHAIN } from '@/src/constants/pool'
import { VESTING_DEALS_QUERY_NAME } from '@/src/queries/pools/vestingDeals'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isSuccessful } from '@/src/utils/isSuccessful'
import { parsePoolName } from '@/src/utils/parsePoolName'

export type ParsedVestingDeal = {
  poolName: string
  poolAddress: string
  dealAddress: string | null
  upfrontDealAddress: string | null
  tokenSymbol: string
  totalAmount: string
  remainingAmountToVest: string
  lastClaim: Date | null
  totalVested: string
  vestingPeriodEnds: Date
  vestingPeriodStarts: Date
  underlyingDealTokenDecimals: number
  isDealTokenTransferable: boolean
  chainId: ChainsValues
}

export async function fetcherVestingDeals(variables: VestingDealsQueryVariables) {
  const allSDK = getAllGqlSDK()

  const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const queryPromises = (): Promise<any>[] =>
    chainIds.map((chainId: ChainsValues) =>
      allSDK[chainId][VESTING_DEALS_QUERY_NAME](variables)
        .then((res) =>
          Promise.all(
            res.vestingDeals.map(async (vestingDeal) => ({
              poolName: parsePoolName(vestingDeal.poolName),
              tokenSymbol: vestingDeal.tokenToVestSymbol,
              totalAmount: vestingDeal.investorDealTotal,
              totalVested: vestingDeal.totalVested,
              lastClaim: vestingDeal.lastClaim ? new Date(vestingDeal.lastClaim * 1000) : null,
              remainingAmountToVest: vestingDeal.remainingAmountToVest,
              vestingPeriodEnds: new Date(vestingDeal.vestingPeriodEnds * 1000),
              vestingPeriodStarts: new Date(vestingDeal.vestingPeriodStarts * 1000),
              poolAddress: vestingDeal.poolAddress,
              dealAddress: vestingDeal.pool.dealAddress,
              isDealTokenTransferable: vestingDeal.pool.isDealTokenTransferable,
              upfrontDealAddress: vestingDeal.pool.upfrontDeal?.id,
              underlyingDealTokenDecimals: vestingDeal.underlyingDealTokenDecimals,
              chainId,
            })),
          ),
        )
        .catch((err) => {
          console.error(`fetch vestingDeals on chain ${chainId} was failed`, err)
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

export enum VestingDealsFilter {
  All = 'All',
  Completed = 'Completed',
  Active = 'Active',
}

export default function useAelinVestingDeals(
  variables: VestingDealsQueryVariables,
  filter: VestingDealsFilter = VestingDealsFilter.Active,
) {
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

  const filteredResults = paginatedResult.filter(() => {
    if (
      filter === VestingDealsFilter.All ||
      filter === VestingDealsFilter.Completed ||
      filter === VestingDealsFilter.Active
    ) {
      return true
    }

    return false
  })

  return {
    data: filteredResults,
    error,
    nextPage,
    currentPage,
    hasMore,
    isValidating,
    mutate,
  }
}
