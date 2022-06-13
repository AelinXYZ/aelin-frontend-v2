import { useCallback, useEffect, useState } from 'react'

import orderBy from 'lodash/orderBy'
import useSWRInfinite from 'swr/infinite'

import useAelinUser, { ParsedUser } from './useAelinUser'
import {
  NotificationTarget,
  NotificationType,
  Notification_OrderBy,
  NotificationsQueryVariables,
  OrderDirection,
} from '@/graphql-schema'
import { ChainsValues, ChainsValuesArray } from '@/src/constants/chains'
import { NOTIFICATIONS_RESULTS_PER_CHAIN } from '@/src/constants/pool'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { NOTIFICATIONS_QUERY_NAME } from '@/src/queries/pools/notification'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'

export type ParsedNotification = {
  id: string
  message: string
  triggerStart: Date
  poolAddress: string
  chainId: ChainsValues
  target: NotificationTarget
  type: NotificationType
}

interface FetcherProps extends NotificationsQueryVariables {
  user?: ParsedUser
  clearedNotifications?: ClearedNotifications
}

export type ClearedNotifications = {
  [key: string]: boolean | undefined
}

function isSuccessful<T>(response: PromiseSettledResult<T>): response is PromiseFulfilledResult<T> {
  return 'value' in response
}

function isUserTarget(user: ParsedUser, notification: ParsedNotification): boolean {
  const { poolAddress, target } = notification
  if (target === NotificationTarget.PoolInvestor) {
    return !!user.poolsInvested.find((poolInvested) => poolInvested.id === poolAddress)
  } else if (target === NotificationTarget.DealInvestor) {
    return !!user.dealsAccepted.find((dealAccepted) => dealAccepted.pool.id === poolAddress)
  } else if (target === NotificationTarget.Sponsor) {
    return !!user.poolsSponsored.find((poolSponsored) => poolSponsored.id === poolAddress)
  } else if (target === NotificationTarget.Holder) {
    return !!user.poolsAsHolder.find((poolAsHolder) => poolAsHolder.id === poolAddress)
  }
  return false
}

export async function fetcherNotifications(props: FetcherProps) {
  const { clearedNotifications, user, ...variables } = props
  const allSDK = getAllGqlSDK()

  if (!user) return []

  const chainIds = Object.keys(allSDK).map(Number) as ChainsValuesArray

  const queryPromises = (): Promise<any>[] =>
    chainIds.map((chainId: ChainsValues) =>
      allSDK[chainId][NOTIFICATIONS_QUERY_NAME](variables)
        .then((res) =>
          res.notifications
            .map((notification) => {
              return {
                id: notification.id,
                message: notification.message,
                triggerStart: new Date(notification.triggerStart * 1000),
                poolAddress: notification.pool.id,
                target: notification.target,
                type: notification.type,
                chainId,
              }
            })
            .filter(
              (notification) =>
                isUserTarget(user, notification) && !clearedNotifications?.[notification.id],
            ),
        )
        .catch((err) => {
          console.error(`fetch notifications on chain ${chainId} was failed`, err)
          return []
        }),
    )

  try {
    const notificationsByChainResponses = await Promise.allSettled(queryPromises())

    let result: (ParsedNotification | undefined)[] = notificationsByChainResponses
      .filter(isSuccessful)
      .reduce((resultAcc: ParsedNotification[], { value }) => [...resultAcc, ...value], [])

    result = orderBy(
      result,
      variables.orderBy as Notification_OrderBy,
      variables.orderDirection ? [variables.orderDirection] : ['desc'],
    )

    if (
      result.length > 0 &&
      result.length < NOTIFICATIONS_RESULTS_PER_CHAIN &&
      typeof props.skip === 'number'
    ) {
      const newResult = await fetcherNotifications({
        ...props,
        skip: props.skip * NOTIFICATIONS_RESULTS_PER_CHAIN + NOTIFICATIONS_RESULTS_PER_CHAIN,
      })
      result = newResult.length ? [...result, ...newResult] : [...result, undefined]
    }

    return result
  } catch (err) {
    console.error(err)
    return []
  }
}

const getSwrKey = (
  currentPage: number,
  previousPageData: ParsedNotification[],
  variables: NotificationsQueryVariables,
  clearedNotifications?: ClearedNotifications,
  user?: ParsedUser,
) => {
  return [
    {
      ...variables,
      skip: currentPage * NOTIFICATIONS_RESULTS_PER_CHAIN,
      first: NOTIFICATIONS_RESULTS_PER_CHAIN,
      user,
      clearedNotifications,
    },
  ]
}

export default function useAelinNotifications(clearedNotifications?: ClearedNotifications) {
  const { address: userAddress } = useWeb3Connection()
  const { data: userResponse, error: errorUser } = useAelinUser(userAddress)
  const [nowSeconds, setNow] = useState<string>()
  const [initialClearedNotifications, setInitialClearedNotifications] =
    useState(clearedNotifications)

  if (errorUser) {
    throw errorUser
  }

  useEffect(() => {
    setNow(Math.round(Date.now() / 1000).toString())
  }, [])

  const variables: NotificationsQueryVariables = {
    orderBy: Notification_OrderBy.TriggerStart,
    orderDirection: OrderDirection.Desc,
    where: {
      pool_in: userResponse?.poolAddresses,
      triggerStart_lt: nowSeconds,
      triggerEnd_gt: nowSeconds,
    },
  }

  const {
    data = [],
    error,
    isValidating,
    mutate,
    setSize: setPage,
    size: currentPage,
  } = useSWRInfinite(
    (...args) => getSwrKey(...args, variables, initialClearedNotifications, userResponse),
    fetcherNotifications,
    {
      revalidateFirstPage: true,
      revalidateOnMount: true,
    },
  )

  const nextPage = useCallback(() => {
    setPage(currentPage + 1)
  }, [setPage, currentPage])

  const paginatedResult = data
    ?.reduce(
      (allResults: ParsedNotification[], pageResults) => [
        ...allResults,
        ...pageResults.filter((pR): pR is ParsedNotification => !!pR),
      ],
      [],
    )
    .filter((notification) => !clearedNotifications?.[notification.id])

  const hasMore =
    !error &&
    data[data.length - 1]?.length !== 0 &&
    data[data.length - 1].slice(-1).pop() !== undefined

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
