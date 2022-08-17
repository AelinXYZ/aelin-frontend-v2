import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { addMilliseconds } from 'date-fns'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import isWithinInterval from 'date-fns/isWithinInterval'
import ms from 'ms'

import { NotificationType } from '@/graphql-schema'
import { ChainsValues } from '@/src/constants/chains'
import { MAX_BN, ZERO_BN } from '@/src/constants/misc'
import { MAX_ALLOWED_DEALS } from '@/src/constants/pool'
import { PoolTimelineState } from '@/src/constants/types'
import useAelinPool, { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useUserAllocationStats } from '@/src/hooks/aelin/useUserAllocationStats'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { calculateDeadlineProgress } from '@/src/utils/aelinPoolUtils'
import { DATE_DETAILED, formatDate, getFormattedDurationFromDateToNow } from '@/src/utils/date'
import { formatToken } from '@/src/web3/bigNumber'
import {
  DerivedStatus,
  Funding,
  PoolAction,
  PoolStatus,
  PoolTab,
  TimelineSteps,
  UserRole,
} from '@/types/aelinPool'

interface ActionTabsState {
  states: PoolAction[]
  active: PoolAction
  setActive: Dispatch<SetStateAction<PoolAction>>
}

interface TabsState {
  states: PoolTab[]
  active: PoolTab
  setActive: (newState: PoolTab) => void
  actionTabs: ActionTabsState
  isReleaseFundsAvailable: boolean
}

function useCurrentStatus(pool: ParsedAelinPool): DerivedStatus {
  const [poolStatus, setPoolStatus] = useState<DerivedStatus>({
    current: PoolStatus.Funding,
    history: [PoolStatus.Funding],
  })

  const getStatus = useCallback(() => {
    const now = Date.now()

    // Funding
    if (isBefore(now, pool.purchaseExpiry)) {
      return {
        current: PoolStatus.Funding,
        history: [PoolStatus.Funding],
      }
    }

    // Seeking deal
    if (
      (isAfter(now, pool.purchaseExpiry) && !pool.deal) ||
      (isAfter(now, pool.purchaseExpiry) &&
        pool.deal &&
        isAfter(now, pool.deal?.holderFundingExpiration as Date) &&
        pool.deal?.holderAlreadyDeposited === false)
    ) {
      return {
        current: PoolStatus.SeekingDeal,
        history: [PoolStatus.Funding, PoolStatus.SeekingDeal],
      }
    }

    // Waiting For Holder
    if (
      pool.deal &&
      isBefore(now, pool.deal.holderFundingExpiration) &&
      pool.deal?.holderAlreadyDeposited === false
    ) {
      return {
        current: PoolStatus.WaitingForHolder,
        history: [PoolStatus.Funding, PoolStatus.SeekingDeal, PoolStatus.WaitingForHolder],
      }
    }

    // Deal Presented
    if (
      pool.deal &&
      pool.deal.holderAlreadyDeposited &&
      pool.deal.redemption &&
      isWithinInterval(now, {
        start: pool.deal?.redemption?.start,
        end: pool.deal.redemption.end,
      })
    ) {
      return {
        current: PoolStatus.DealPresented,
        history: [
          PoolStatus.Funding,
          PoolStatus.SeekingDeal,
          PoolStatus.WaitingForHolder,
          PoolStatus.DealPresented,
        ],
      }
    }

    // Vesting
    if (
      pool.deal &&
      pool.deal.holderAlreadyDeposited &&
      pool.deal.redemption &&
      isAfter(now, pool.deal.redemption?.end) &&
      pool.deal.vestingPeriod.end
    ) {
      return {
        current: PoolStatus.Vesting,
        history: [
          PoolStatus.Funding,
          PoolStatus.SeekingDeal,
          PoolStatus.WaitingForHolder,
          PoolStatus.DealPresented,
          PoolStatus.Vesting,
        ],
      }
    }

    throw new Error('Unexpected stage')
  }, [pool])

  // we do this to initialize the correct pool status
  useEffect(() => {
    const newStatus = getStatus()
    setPoolStatus(newStatus)
  }, [getStatus])

  // Interval to update the pool status, if the pool is active, we need to make sure
  // we update the status regularly, to keep the UI consistent.
  useEffect(() => {
    const interval = setInterval(() => {
      const newStatus = getStatus()
      if (poolStatus.current !== newStatus.current) {
        setPoolStatus(newStatus)
      }
    }, ms('30s'))

    return () => clearInterval(interval)
  }, [getStatus, poolStatus])

  return poolStatus
}

function useFundingStatus(pool: ParsedAelinPool, derivedStatus: DerivedStatus): Funding {
  return useMemo(() => {
    derivedStatus // used to force re-render
    const isCap = pool.poolCap.raw.eq(0)
    const capAmount = pool.poolCap.raw
    const funded = pool.funded.raw
    const maxDepositAllowed = capAmount.sub(funded)

    return {
      isCap,
      capReached: isCap ? false : capAmount.eq(funded),
      maxDepositAllowed: {
        raw: isCap ? MAX_BN : maxDepositAllowed,
        formatted: formatToken(maxDepositAllowed, pool.investmentTokenDecimals),
      },
    }
  }, [pool.funded.raw, pool.investmentTokenDecimals, pool.poolCap.raw, derivedStatus])
}

function useUserRole(
  walletAddress: string | null,
  pool: ParsedAelinPool,
  derivedStatus: DerivedStatus,
): UserRole {
  return useMemo(() => {
    let userRole = UserRole.Investor

    if (!walletAddress) {
      userRole = UserRole.Visitor
      return userRole
    }

    const address = walletAddress.toLowerCase()

    if (address === pool.sponsor) {
      userRole = UserRole.Sponsor
    }

    if (address === pool.deal?.holderAddress && derivedStatus.current !== PoolStatus.SeekingDeal) {
      userRole = UserRole.Holder
    }

    return userRole
  }, [walletAddress, pool, derivedStatus])
}

function useUserActions(
  userRole: UserRole,
  pool: ParsedAelinPool,
  derivedStatus: DerivedStatus,
): PoolAction[] {
  const { address: walletAddress } = useWeb3Connection()
  const currentStatus = derivedStatus.current

  const { data: userAllocationStats, refetch } = useUserAllocationStats(
    pool.address,
    pool.chainId,
    pool.investmentTokenDecimals,
  )

  useEffect(() => {
    refetch()
  }, [refetch, pool.amountInPool])

  return useMemo(() => {
    const actions: PoolAction[] = []
    const isSponsor = userRole === UserRole.Sponsor
    const now = new Date()
    const userPoolBalance = BigNumber.from(userAllocationStats.raw)

    // Funding
    if (currentStatus === PoolStatus.Funding) {
      return [PoolAction.Invest]
    }

    // Seeking Deal
    if (currentStatus === PoolStatus.SeekingDeal) {
      // Create deal
      // Conditions:
      // No deal presented or
      // Deal expired, not funded and dealsCreated < MAX_ALLOWED_DEALS
      if (isSponsor) {
        if (!pool.dealAddress) {
          actions.push(PoolAction.CreateDeal)
        } else if (pool.deal) {
          const holderDepositExpired = isAfter(now, pool.deal.holderFundingExpiration)

          if (
            !pool.deal.holderAlreadyDeposited &&
            holderDepositExpired &&
            pool.dealsCreated < MAX_ALLOWED_DEALS
          ) {
            actions.push(PoolAction.CreateDeal)
          }
        }
      }

      // Release funds. It a escape hatch for the case where Sponsor won't be able to create a deal with Holder.
      // It creates a deal, setting holder = sponsor and fund pool deadline = Lowest possible, at the moment of writing it 30m on mainnet.
      // Conditions:
      // If no deal was presented or deal is due and holder is different than sponsor
      if (
        (isSponsor && !pool.dealAddress) ||
        (isSponsor &&
          pool.dealAddress &&
          isAfter(now, pool.dealDeadline) &&
          pool.deal?.holderAddress === (walletAddress as string).toLowerCase())
      ) {
        actions.push(PoolAction.ReleaseFunds)
      }

      // Awaiting for deal information
      // hidden for sponsor.
      if (
        !isSponsor &&
        (!pool.dealAddress ||
          (pool.dealAddress &&
            !pool.deal?.holderAlreadyDeposited &&
            isBefore(now, pool.dealDeadline)))
      ) {
        actions.push(PoolAction.AwaitingForDeal)
      }

      // Withdraw
      if (
        userPoolBalance.gt(ZERO_BN) &&
        (isAfter(now, pool.dealDeadline) || (pool.dealAddress && pool.deal?.holderAlreadyDeposited))
      ) {
        actions.push(PoolAction.Withdraw)
      }

      return actions
    }

    // Waiting for holder
    if (currentStatus === PoolStatus.WaitingForHolder) {
      if (userRole !== UserRole.Holder) {
        actions.push(PoolAction.AwaitingForDeal)
      }

      // Fund deal
      if (
        userRole === UserRole.Holder &&
        pool.deal &&
        !pool.deal.holderAlreadyDeposited &&
        isBefore(now, pool.deal.holderFundingExpiration)
      ) {
        actions.push(PoolAction.FundDeal)
      }

      return actions
    }

    // Deal Active (Holder already deposited)
    if (currentStatus === PoolStatus.DealPresented) {
      if (!pool.deal) {
        return []
      }

      // Accept deal. For investors
      if (
        userPoolBalance.gt(ZERO_BN) &&
        pool.deal.redemption &&
        isBefore(now, pool.deal.redemption?.end)
      ) {
        actions.push(PoolAction.AcceptDeal)
      }

      // Withdraw investment. For investors
      // if holder already deposited or if the deadline to fund the pool is reached.
      if (
        userPoolBalance.gt(ZERO_BN) &&
        (isAfter(now, pool.deal.holderFundingExpiration) || pool.deal.holderAlreadyDeposited)
      ) {
        actions.push(PoolAction.Withdraw)
      }

      return actions
    }

    if (currentStatus === PoolStatus.Closed) {
      return userPoolBalance.gt(ZERO_BN) ? [PoolAction.Withdraw] : []
    }

    if (currentStatus === PoolStatus.Vesting) {
      return userPoolBalance.gt(ZERO_BN)
        ? [PoolAction.Vest, PoolAction.Withdraw]
        : [PoolAction.Vest]
    }

    return []
  }, [userRole, currentStatus, pool, walletAddress, userAllocationStats.raw])
}

function useUserTabs(
  pool: ParsedAelinPool,
  derivedStatus: DerivedStatus,
  userRole: UserRole,
  defaultTab?: NotificationType,
): TabsState {
  const { history } = derivedStatus
  const userActions = useUserActions(userRole, pool, derivedStatus)
  const tabsActions = useMemo(
    () => userActions.filter((action) => action !== PoolAction.ReleaseFunds),
    [userActions],
  )
  const [activeTab, setActiveTab] = useState<PoolTab>('' as unknown as PoolTab)
  const [activeAction, setActiveAction] = useState<PoolAction>('' as unknown as PoolAction)

  // prevent re-assignation
  useEffect(() => {
    setActiveTab(PoolTab.PoolInformation)
  }, [])

  // prevent re-assignation
  useEffect(() => {
    if (!activeAction) {
      setActiveAction(tabsActions[0])
    }
  }, [tabsActions, activeAction])

  const handleTabChange = (newState: PoolTab) => {
    setActiveTab(newState)
    if (newState === PoolTab.WithdrawUnredeemed) {
      setActiveAction(PoolAction.WithdrawUnredeemed)
    } else {
      setActiveAction(tabsActions[0])
    }
  }

  function getTabsActions(activeTab: PoolTab) {
    if (activeTab === PoolTab.WithdrawUnredeemed) {
      return [PoolAction.WithdrawUnredeemed]
    }

    return tabsActions
  }

  const isNotificationType = (type?: NotificationType) =>
    (Object.values(NotificationType) as Array<NotificationType>).some((n) => n === type)

  const tabs = useMemo(() => {
    const tabs: PoolTab[] = [PoolTab.PoolInformation]

    if (history.includes(PoolStatus.DealPresented)) {
      // only show dealInformation if the deal was funded by the holder
      if (pool.deal?.holderAlreadyDeposited) {
        tabs.push(PoolTab.DealInformation)
      }
    }

    if (history.includes(PoolStatus.Vesting)) {
      if (pool.deal?.unredeemed.raw.gt(0) && userRole === UserRole.Holder) {
        tabs.push(PoolTab.WithdrawUnredeemed)
      }
      tabs.push(PoolTab.Vest)
    }

    if (defaultTab && isNotificationType(defaultTab)) {
      switch (defaultTab) {
        case NotificationType.DealNotFunded:
          setActiveTab(PoolTab.PoolInformation)
          setActiveAction(PoolAction.CreateDeal)
          break
        case NotificationType.InvestmentWindowAlert:
          setActiveTab(PoolTab.PoolInformation)
          setActiveAction(tabsActions[0])
          break
        case NotificationType.InvestmentWindowEnded:
          if (pool.deal?.holderAlreadyDeposited) {
            setActiveTab(PoolTab.DealInformation)
            setActiveAction(PoolAction.CreateDeal)
          } else {
            setActiveTab(tabs[tabs.length - 1])
            setActiveAction(tabsActions[0])
          }
          break
        case NotificationType.HolderSet:
          if (pool.deal?.holderAlreadyDeposited) {
            setActiveTab(PoolTab.DealInformation)
          } else {
            setActiveTab(PoolTab.PoolInformation)
            setActiveAction(PoolAction.FundDeal)
          }
          break
        case NotificationType.DealProposed:
        case NotificationType.FundingWindowAlert:
        case NotificationType.VestingCliffBegun:
          if (pool.deal?.holderAlreadyDeposited) {
            setActiveTab(PoolTab.DealInformation)
            setActiveAction(tabsActions[0])
          }
          break
        case NotificationType.FundingWindowEnded:
          setActiveTab(PoolTab.PoolInformation)
          userRole === UserRole.Sponsor
            ? setActiveAction(PoolAction.CreateDeal)
            : setActiveAction(PoolAction.Withdraw)
          break
        case NotificationType.DealTokensVestingBegun:
        case NotificationType.AllDealTokensVested:
        case NotificationType.SponsorFeesReady:
          setActiveTab(PoolTab.Vest)
          setActiveAction(PoolAction.Vest)
          break
        case NotificationType.WithdrawUnredeemed:
          if (pool.deal?.unredeemed.raw.gt(0) && userRole === UserRole.Holder) {
            setActiveTab(PoolTab.WithdrawUnredeemed)
            setActiveAction(PoolAction.WithdrawUnredeemed)
          } else {
            setActiveTab(tabs[tabs.length - 1])
          }
          break
        default:
          setActiveTab(tabs[tabs.length - 1])
      }
    } else {
      if (tabs.includes(PoolTab.WithdrawUnredeemed) && pool.deal?.unredeemed.raw.gt(0)) {
        setActiveTab(PoolTab.WithdrawUnredeemed)
        setActiveAction(PoolAction.WithdrawUnredeemed)
      } else {
        setActiveTab(tabs[tabs.length - 1])
        setActiveAction(tabsActions[0])
      }
    }

    return tabs
  }, [pool, history, userRole, tabsActions, defaultTab])

  return {
    states: tabs,
    active: activeTab,
    setActive: handleTabChange,
    actionTabs: {
      states: getTabsActions(activeTab),
      active: activeAction,
      setActive: setActiveAction,
    },
    isReleaseFundsAvailable: userActions.includes(PoolAction.ReleaseFunds),
  }
}

export function useTimelineStatus(pool?: ParsedAelinPool): TimelineSteps {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), ms('30s'))
    return () => clearInterval(interval)
  }, [])

  return useMemo(() => {
    return {
      [PoolTimelineState.poolCreation]: {
        isDefined: true,
        active: !pool,
        isDone: !!pool,
        withDeadlineBar: false,
        value: pool ? formatDate(pool.start, DATE_DETAILED) : '--',
      },
      [PoolTimelineState.investmentDeadline]: {
        isDefined: true,
        active: pool ? isBefore(now, pool.purchaseExpiry) : false,
        isDone: pool ? isAfter(now, pool.purchaseExpiry) : false,
        withDeadlineBar: true,
        deadline: pool
          ? isBefore(now, pool.purchaseExpiry)
            ? getFormattedDurationFromDateToNow(pool.purchaseExpiry)
            : `Ended ${formatDate(pool.purchaseExpiry, DATE_DETAILED)}`
          : '',
        deadlineProgress: pool ? calculateDeadlineProgress(pool.purchaseExpiry, pool.start) : '0',
        value: pool ? `Ends ${formatDate(pool.purchaseExpiry, DATE_DETAILED)}` : '--',
      },
      [PoolTimelineState.dealCreation]: {
        isDefined: true,
        withDeadlineBar: false,
        active: pool ? isAfter(now, pool.purchaseExpiry) && !pool.dealAddress : false,
        isDone: pool ? !!pool.dealAddress : false,
        value: pool?.deal ? formatDate(pool.deal.createdAt, DATE_DETAILED) : '--',
      },
      [PoolTimelineState.dealDeadline]: {
        isDefined: true,
        withDeadlineBar: true,
        active:
          !!pool?.deal && isAfter(now, pool.deal.createdAt) && !pool.deal?.holderAlreadyDeposited,
        isDone: !!pool?.deal?.holderAlreadyDeposited,
        deadline: pool?.deal
          ? pool.deal.holderAlreadyDeposited && pool.deal.fundedAt
            ? `Funded ${formatDate(pool.deal.fundedAt, DATE_DETAILED)}`
            : getFormattedDurationFromDateToNow(pool.deal.holderFundingExpiration)
          : '',
        deadlineProgress: pool?.deal
          ? pool.deal.holderAlreadyDeposited
            ? '0'
            : calculateDeadlineProgress(pool.deal.holderFundingExpiration, pool.deal.createdAt)
          : '0',
        value: pool?.deal
          ? isAfter(now, pool.deal?.holderFundingExpiration)
            ? `Ended ${formatDate(pool.deal.holderFundingExpiration, DATE_DETAILED)}`
            : pool.deal.holderAlreadyDeposited
            ? getFormattedDurationFromDateToNow(pool.deal.holderFundingExpiration)
            : ''
          : '--',
      },
      [PoolTimelineState.proRataRedemption]: {
        isDefined: true,
        withDeadlineBar: true,
        active:
          !!pool?.deal?.holderAlreadyDeposited &&
          !!pool?.deal.redemption &&
          isBefore(now, pool.deal.redemption.proRataRedemptionEnd),
        isDone:
          !!pool?.deal?.holderAlreadyDeposited &&
          !!pool?.deal.redemption &&
          isAfter(now, pool?.deal.redemption.proRataRedemptionEnd),
        deadline:
          pool?.deal &&
          pool?.deal?.redemption &&
          pool.deal.holderAlreadyDeposited &&
          pool.deal.redemption.proRataRedemptionEnd
            ? isBefore(now, pool.deal.redemption.proRataRedemptionEnd)
              ? getFormattedDurationFromDateToNow(pool.deal.redemption.proRataRedemptionEnd)
              : `Ended ${formatDate(
                  pool?.deal?.redemption?.proRataRedemptionEnd as Date,
                  DATE_DETAILED,
                )}`
            : '',
        deadlineProgress:
          pool?.deal && pool?.deal?.redemption
            ? calculateDeadlineProgress(
                pool.deal.redemption.proRataRedemptionEnd,
                pool.deal.redemption.proRataRedemptionStart,
              )
            : '0',
        value:
          pool?.deal &&
          pool?.deal?.redemption &&
          pool.deal.redemption.proRataRedemptionEnd &&
          pool.deal.holderAlreadyDeposited
            ? `Ends ${formatDate(pool.deal.redemption.proRataRedemptionEnd, DATE_DETAILED)}`
            : '--',
      },
      [PoolTimelineState.openRedemption]: {
        isDefined: !!pool?.deal?.hasDealOpenPeriod,
        withDeadlineBar: true,
        active:
          !!pool?.deal?.holderAlreadyDeposited &&
          !!pool?.deal.redemption?.openRedemptionEnd &&
          !!pool?.deal.redemption?.proRataRedemptionEnd &&
          isWithinInterval(now, {
            start: pool.deal.redemption.proRataRedemptionEnd,
            end: pool.deal.redemption.openRedemptionEnd,
          }),
        isDone:
          !!pool?.deal?.holderAlreadyDeposited &&
          !!pool?.deal.redemption?.openRedemptionEnd &&
          isAfter(now, pool.deal.redemption.openRedemptionEnd),
        deadline:
          pool?.deal &&
          pool?.deal?.redemption?.openRedemptionEnd &&
          isAfter(now, pool.deal.redemption.proRataRedemptionEnd)
            ? !!pool?.deal.holderAlreadyDeposited &&
              isBefore(now, pool.deal.redemption.openRedemptionEnd)
              ? getFormattedDurationFromDateToNow(pool.deal.redemption.openRedemptionEnd)
              : `Ended ${formatDate(
                  pool?.deal?.redemption?.openRedemptionEnd as Date,
                  DATE_DETAILED,
                )}`
            : '',
        deadlineProgress: pool?.deal?.redemption?.openRedemptionEnd
          ? calculateDeadlineProgress(
              pool.deal.redemption.openRedemptionEnd,
              pool.deal.redemption.proRataRedemptionEnd,
            )
          : '0',
        value:
          pool?.deal &&
          pool.deal.redemption?.openRedemptionEnd &&
          pool.deal.holderAlreadyDeposited &&
          isAfter(now, pool.deal.redemption.proRataRedemptionEnd)
            ? `Ends ${formatDate(pool.deal.redemption.openRedemptionEnd, DATE_DETAILED)}`
            : '--',
      },
      [PoolTimelineState.vestingCliff]: {
        active:
          !!pool?.deal?.redemption &&
          isWithinInterval(now, {
            start: pool.deal.redemption.end,
            end: pool.deal.vestingPeriod.cliff.end as Date,
          }),
        withDeadlineBar: true,
        isDone: !!pool?.deal?.redemption && isAfter(now, pool.deal.vestingPeriod.cliff.end as Date),
        isDefined: !!pool?.deal && pool?.deal.vestingPeriod.cliff.ms > 0,
        deadline:
          pool?.deal && pool?.deal?.redemption?.end && pool?.deal?.vestingPeriod.cliff.end
            ? isWithinInterval(now, {
                start: pool.deal.redemption.end,
                end: pool.deal.vestingPeriod.cliff.end as Date,
              })
              ? getFormattedDurationFromDateToNow(pool.deal.vestingPeriod.cliff.end as Date)
              : isAfter(now, pool.deal.vestingPeriod.cliff.end as Date)
              ? `Ended ${formatDate(pool.deal.vestingPeriod.cliff.end as Date, DATE_DETAILED)}`
              : ''
            : '',

        deadlineProgress:
          pool?.deal?.redemption && isAfter(now, pool.deal.redemption.end)
            ? calculateDeadlineProgress(
                addMilliseconds(pool.deal.redemption.end, pool.deal.vestingPeriod.cliff.ms),
                pool.deal.redemption.end,
              )
            : '0',
        value:
          pool?.deal?.redemption && isAfter(now, pool.deal.redemption.end)
            ? `Ends ${formatDate(
                addMilliseconds(pool.deal.redemption.end, pool.deal.vestingPeriod.cliff.ms),
                DATE_DETAILED,
              )}`
            : '--',
      },
      [PoolTimelineState.vestingPeriod]: {
        active:
          !!pool?.deal?.redemption &&
          !!pool.deal.vestingPeriod.cliff.end &&
          isAfter(now, pool.deal.vestingPeriod.cliff.end as Date),
        withDeadlineBar: true,
        isDone:
          !!pool?.deal?.redemption && isAfter(now, pool.deal.vestingPeriod.vesting.end as Date),
        isDefined: true,
        deadline:
          pool?.deal && pool?.deal?.redemption && pool.deal.vestingPeriod
            ? isAfter(now, pool.deal.vestingPeriod.cliff.end as Date) &&
              isBefore(now, pool.deal.vestingPeriod.vesting.end as Date)
              ? getFormattedDurationFromDateToNow(pool.deal.vestingPeriod.vesting.end as Date)
              : isAfter(now, pool.deal.vestingPeriod.vesting.end as Date)
              ? `Ended ${formatDate(pool?.deal?.vestingPeriod.vesting.end as Date, DATE_DETAILED)}`
              : ''
            : '',
        deadlineProgress: pool?.deal
          ? pool?.deal?.redemption &&
            isAfter(now, pool.deal.vestingPeriod.cliff.end as Date) &&
            isBefore(now, pool.deal.vestingPeriod.vesting.end as Date)
            ? calculateDeadlineProgress(
                addMilliseconds(
                  pool.deal.redemption.end,
                  pool.deal.vestingPeriod.cliff.ms + pool.deal.vestingPeriod.vesting.ms,
                ),
                addMilliseconds(pool.deal.redemption.end, pool.deal.vestingPeriod.cliff.ms),
              )
            : '0'
          : '',
        value: pool?.deal
          ? pool?.deal?.redemption &&
            isAfter(now, pool.deal.vestingPeriod.cliff.end as Date) &&
            isBefore(now, pool.deal.vestingPeriod.vesting.end as Date)
            ? `Ends ${formatDate(
                addMilliseconds(
                  pool.deal.redemption.end,
                  pool.deal.vestingPeriod.cliff.ms + pool.deal.vestingPeriod.vesting.ms,
                ),
                DATE_DETAILED,
              )}`
            : '--'
          : '--',
      },
    }
  }, [pool, now])
}

type InitialData = {
  tabs: NotificationType
}

export default function useAelinPoolStatus(
  chainId: ChainsValues,
  poolAddress: string,
  initialData?: InitialData,
) {
  const { pool: poolResponse, refetch: refetchPool } = useAelinPool(chainId, poolAddress, {
    refreshInterval: ms('5s'),
  })

  const { address } = useWeb3Connection()

  // derive data for UI
  const derivedStatus = useCurrentStatus(poolResponse)

  const userRole = useUserRole(address, poolResponse, derivedStatus)
  const tabs = useUserTabs(poolResponse, derivedStatus, userRole, initialData?.tabs)
  const funding = useFundingStatus(poolResponse, derivedStatus)
  const timeline = useTimelineStatus(poolResponse)

  return useMemo(
    () => ({
      refetchPool,
      pool: poolResponse,
      userRole,
      funding,
      tabs,
      timeline,
      derivedStatus,
    }),
    [refetchPool, poolResponse, userRole, funding, tabs, timeline, derivedStatus],
  )
}
