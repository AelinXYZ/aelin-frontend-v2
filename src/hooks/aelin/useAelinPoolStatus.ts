import { Dispatch, SetStateAction, useMemo, useState } from 'react'

import { addMilliseconds } from 'date-fns'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import isWithinInterval from 'date-fns/isWithinInterval'
import ms from 'ms'

import { ChainsValues } from '@/src/constants/chains'
import { MAX_BN, ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { MAX_ALLOWED_DEALS } from '@/src/constants/pool'
import { PoolTimelineState } from '@/src/constants/types'
import useAelinPool from '@/src/hooks/aelin/useAelinPool'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useUserAllocationStat } from '@/src/hooks/aelin/useUserAllocationStats'
import useAelinPoolCall from '@/src/hooks/contracts/useAelinPoolCall'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
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
  ProRata,
  TimelineSteps,
  UserRole,
  WaitingForDeal,
} from '@/types/aelinPool'

function useFundingStatus(pool: ParsedAelinPool, chainId: ChainsValues): Funding {
  const { address } = useWeb3Connection()
  const { data: userAllocationStatRes } = useUserAllocationStat(pool.address, chainId)
  const [userInvestmentTokenBalance, refetchUserInvestmentTokenBalance] = useERC20Call(
    pool.chainId,
    pool.investmentToken,
    'balanceOf',
    [address || ZERO_ADDRESS],
  )

  const [userAllowance, refetchUserAllowance] = useERC20Call(
    pool.chainId,
    pool.investmentToken,
    'allowance',
    [address || ZERO_ADDRESS, pool.address],
  )

  const isCap = pool.poolCap.raw.eq(0)
  const capAmount = pool.poolCap.raw
  const funded = pool.funded.raw
  const maxDepositAllowed = capAmount.sub(funded)

  return {
    isCap,
    capReached: isCap ? false : capAmount.eq(funded),
    userAllowance: userAllowance || ZERO_BN,
    refetchUserAllowance,
    maxDepositAllowed: {
      raw: isCap ? MAX_BN : maxDepositAllowed,
      formatted: formatToken(maxDepositAllowed, pool.investmentTokenDecimals),
    },
    poolTokenBalance: {
      raw: userAllocationStatRes?.userAllocationStat?.poolTokenBalance,
      formatted: formatToken(
        userAllocationStatRes?.userAllocationStat?.poolTokenBalance,
        pool.investmentTokenDecimals,
      ),
    },
    userInvestmentTokenBalance: {
      raw: userInvestmentTokenBalance || ZERO_BN,
      formatted: formatToken(userInvestmentTokenBalance || ZERO_BN, pool.investmentTokenDecimals),
    },
    refetchUserInvestmentTokenBalance,
  }
}

function useDealingStatus(pool: ParsedAelinPool, chainId: ChainsValues): WaitingForDeal {
  const { address } = useWeb3Connection()
  const walletAddress = address || ZERO_ADDRESS
  const { data: userAllocationStatRes, refetch: refetchUserWithdrawn } = useUserAllocationStat(
    pool.address,
    chainId,
  )
  // TODO: make this calls in a single request
  const [maxProRataAmountBalance, refetchMaxProRataAmountBalance] = useAelinPoolCall(
    pool.chainId,
    pool.address,
    'maxProRataAmount',
    [walletAddress],
  )

  const [walletPoolBalance, refetchWalletPoolBalance] = useAelinPoolCall(
    pool.chainId,
    pool.address,
    'balanceOf',
    [walletAddress],
  )
  const safeWalletPoolBalance = walletPoolBalance || ZERO_BN

  const [maxPurchaseDealAllowed, refetchMaxPurchaseDealAllowed] = useAelinPoolCall(
    pool.chainId,
    pool.address,
    'purchaseTokenTotalForDeal',
    [],
  )

  const [totalAmountAccepted, refetchTotalAmountAccepted] = useAelinPoolCall(
    pool.chainId,
    pool.address,
    'totalAmountAccepted',
    [],
  )

  const userAmountWithdrawn = userAllocationStatRes?.userAllocationStat?.totalWithdrawn || ZERO_BN

  const maxOpenRedemptionAvailable =
    maxPurchaseDealAllowed?.sub(totalAmountAccepted || ZERO_BN) || ZERO_BN
  const maxOpenRedemptionBalance = safeWalletPoolBalance.gt(maxOpenRedemptionAvailable)
    ? maxOpenRedemptionAvailable
    : safeWalletPoolBalance

  const userMaxAllocation =
    pool.deal?.redemption?.stage === 1
      ? maxProRataAmountBalance || ZERO_BN
      : maxOpenRedemptionBalance

  return {
    refetchUserStats: () => {
      refetchUserWithdrawn()
      refetchMaxProRataAmountBalance()
      refetchWalletPoolBalance()
      refetchMaxPurchaseDealAllowed()
      refetchTotalAmountAccepted()
    },
    userTotalWithdrawn: {
      raw: userAmountWithdrawn,
      formatted: formatToken(userAmountWithdrawn, pool.investmentTokenDecimals),
    },
    userMaxAllocation: {
      raw: userMaxAllocation,
      formatted: formatToken(userMaxAllocation, pool.investmentTokenDecimals) || '0',
    },
  }
}

function useProRataStatus(pool: ParsedAelinPool): ProRata {
  return {}
}

function useCurrentStatus(pool: ParsedAelinPool): DerivedStatus {
  return useMemo(() => {
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
}

export function useUserRole(
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

interface ActionState {
  states: PoolAction[]
  active: PoolAction
  setActive: Dispatch<SetStateAction<PoolAction>>
}
interface TabState {
  states: PoolTab[]
  active: PoolTab
  setActive: (newState: PoolTab) => void
  actions: ActionState
}

function useUserActions(
  userRole: UserRole,
  pool: ParsedAelinPool,
  derivedStatus: DerivedStatus,
): PoolAction[] {
  const { address: walletAddress } = useWeb3Connection()
  const currentStatus = derivedStatus.current

  return useMemo(() => {
    const actions: PoolAction[] = []
    const isSponsor = userRole === UserRole.Sponsor
    const now = new Date()

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
        isAfter(now, pool.dealDeadline) ||
        (pool.dealAddress && pool.deal?.holderAlreadyDeposited)
      ) {
        actions.push(PoolAction.Withdraw)
      }

      return actions
    }

    if (currentStatus === PoolStatus.WaitingForHolder) {
      // Fund deal
      if (
        currentStatus === PoolStatus.WaitingForHolder &&
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
      if (pool.deal.redemption && isBefore(now, pool.deal.redemption?.end)) {
        actions.push(PoolAction.AcceptDeal)
      }

      // Withdraw investment. For investors
      // if holder already deposited or if the deadline to fund the pool is reached.
      if (isAfter(now, pool.deal.holderFundingExpiration) || pool.deal.holderAlreadyDeposited) {
        actions.push(PoolAction.Withdraw)
      }

      return actions
    }

    if (currentStatus === PoolStatus.Closed) {
      return [PoolAction.Withdraw]
    }

    if (currentStatus === PoolStatus.Vesting) {
      return [PoolAction.Withdraw, PoolAction.Claim]
    }

    return []
  }, [userRole, currentStatus, pool, walletAddress])
}

function useUserTabs(
  pool: ParsedAelinPool,
  derivedStatus: DerivedStatus,
  userRole: UserRole,
): TabState {
  const { history } = derivedStatus
  const actionsStates = useUserActions(userRole, pool, derivedStatus)
  const [activeTab, setActiveTab] = useState<PoolTab>(PoolTab.PoolInformation)
  const [activeAction, setActiveAction] = useState<PoolAction>(actionsStates[0])

  const handleTabChange = (newState: PoolTab) => {
    setActiveTab(newState)
    if (newState === PoolTab.WithdrawUnredeemed) {
      setActiveAction(PoolAction.WithdrawUnredeemed)
    } else {
      setActiveAction(actionsStates[0])
    }
  }

  const getActionStates = (newState: PoolTab) => {
    if (newState === PoolTab.WithdrawUnredeemed) {
      return [PoolAction.WithdrawUnredeemed]
    }
    return actionsStates
  }

  const tabStates = useMemo(() => {
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

    if (tabs.includes(PoolTab.WithdrawUnredeemed)) {
      setActiveTab(PoolTab.WithdrawUnredeemed)
      setActiveAction(PoolAction.WithdrawUnredeemed)
    } else {
      setActiveTab(tabs[tabs.length - 1])
      setActiveAction(actionsStates[0])
    }

    return tabs
  }, [pool, history, userRole, actionsStates])

  return {
    states: tabStates,
    active: activeTab,
    setActive: handleTabChange,
    actions: {
      states: getActionStates(activeTab),
      active: activeAction,
      setActive: setActiveAction,
    },
  }
}

function useTimelineStatus(pool: ParsedAelinPool): TimelineSteps {
  const now = Date.now()

  const getStepDeadline = (deadline: Date, message?: string) =>
    getFormattedDurationFromDateToNow(
      deadline,
      message ?? `Ended ${formatDate(deadline, DATE_DETAILED)}`,
    )

  return {
    [PoolTimelineState.poolCreation]: {
      isDefined: true,
      active: false,
      isDone: true,
      value: formatDate(pool.start, DATE_DETAILED),
    },
    [PoolTimelineState.investmentWindow]: {
      isDefined: true,
      active: isBefore(now, pool.purchaseExpiry),
      isDone: isAfter(now, pool.purchaseExpiry),
      deadline: getStepDeadline(pool.purchaseExpiry),
      deadlineProgress: calculateDeadlineProgress(pool.purchaseExpiry, pool.start),
      value: `Ends ${formatDate(pool.purchaseExpiry, DATE_DETAILED)}`,
    },
    [PoolTimelineState.dealCreation]: {
      isDefined: true,
      active: isAfter(now, pool.purchaseExpiry) && !pool.dealAddress,
      isDone: !!pool.dealAddress,
      value: pool.deal ? formatDate(pool.deal.createdAt, DATE_DETAILED) : '',
    },
    [PoolTimelineState.dealWindow]: {
      isDefined: true,
      active:
        !!pool.deal && isAfter(now, pool.deal.createdAt) && !pool.deal?.holderAlreadyDeposited,
      isDone: !!pool.deal?.holderAlreadyDeposited,
      deadline: pool.deal
        ? pool.deal.holderAlreadyDeposited && pool.deal.fundedAt
          ? `Funded ${formatDate(pool.deal.fundedAt, DATE_DETAILED)}`
          : getStepDeadline(pool.deal.holderFundingExpiration)
        : undefined,
      deadlineProgress: pool.deal
        ? pool.deal.holderAlreadyDeposited
          ? '0'
          : calculateDeadlineProgress(pool.deal.holderFundingExpiration, pool.deal.createdAt)
        : '0',
      value:
        pool.deal && pool.deal?.holderAlreadyDeposited
          ? `Ends ${formatDate(pool.deal.holderFundingExpiration, DATE_DETAILED)}`
          : '',
    },
    [PoolTimelineState.proRataRedemption]: {
      isDefined: true,
      active:
        !!pool.deal?.holderAlreadyDeposited &&
        !!pool.deal.redemption &&
        isBefore(now, pool.deal.redemption.proRataRedemptionEnd),
      isDone:
        !!pool.deal?.holderAlreadyDeposited &&
        !!pool.deal.redemption &&
        isAfter(now, pool.deal.redemption.proRataRedemptionEnd),
      deadline:
        pool.deal?.redemption && pool.deal.holderAlreadyDeposited
          ? getStepDeadline(pool.deal.redemption.proRataRedemptionEnd)
          : undefined,
      deadlineProgress: pool.deal?.redemption
        ? calculateDeadlineProgress(
            pool.deal.redemption.proRataRedemptionEnd,
            pool.deal.redemption.proRataRedemptionStart,
          )
        : '0',
      value:
        pool.deal?.redemption && pool.deal.holderAlreadyDeposited
          ? `Ends ${formatDate(pool.deal.redemption.proRataRedemptionEnd, DATE_DETAILED)}`
          : '',
    },
    [PoolTimelineState.openRedemption]: {
      isDefined: !!pool.deal?.hasDealOpenPeriod,
      active:
        !!pool.deal?.holderAlreadyDeposited &&
        !!pool.deal.redemption?.openRedemptionEnd &&
        isBefore(now, pool.deal.redemption.openRedemptionEnd),
      isDone:
        !!pool.deal?.holderAlreadyDeposited &&
        !!pool.deal.redemption?.openRedemptionEnd &&
        isAfter(now, pool.deal.redemption.openRedemptionEnd),
      deadline:
        pool.deal?.redemption?.openRedemptionEnd && pool.deal.holderAlreadyDeposited
          ? getStepDeadline(pool.deal.redemption.openRedemptionEnd)
          : undefined,
      deadlineProgress: pool.deal?.redemption?.openRedemptionEnd
        ? calculateDeadlineProgress(
            pool.deal.redemption.openRedemptionEnd,
            pool.deal.redemption.proRataRedemptionEnd,
          )
        : '0',
      value:
        pool.deal?.redemption?.openRedemptionEnd && pool.deal.holderAlreadyDeposited
          ? `Ends ${formatDate(pool.deal.redemption.openRedemptionEnd, DATE_DETAILED)}`
          : '',
    },
    [PoolTimelineState.vestingCliff]: {
      active:
        !!pool.deal?.redemption &&
        isWithinInterval(now, {
          start: pool.deal.redemption.end,
          end: addMilliseconds(pool.deal.redemption.end, pool.deal.vestingPeriod.cliff.ms),
        }),
      isDone:
        !!pool.deal?.redemption &&
        isAfter(now, addMilliseconds(pool.deal.redemption.end, pool.deal.vestingPeriod.cliff.ms)),
      isDefined: !!pool.deal && pool.deal.vestingPeriod.cliff.ms > 0,
      deadline:
        pool.deal?.redemption && isAfter(now, pool.deal.redemption.end)
          ? getStepDeadline(
              addMilliseconds(pool.deal.redemption.end, pool.deal.vestingPeriod.cliff.ms),
            )
          : undefined,
      deadlineProgress:
        pool.deal?.redemption && isAfter(now, pool.deal.redemption.end)
          ? calculateDeadlineProgress(
              addMilliseconds(pool.deal.redemption.end, pool.deal.vestingPeriod.cliff.ms),
              pool.deal.redemption.end,
            )
          : '0',
      value:
        pool.deal?.redemption && isAfter(now, pool.deal.redemption.end)
          ? `Ends ${formatDate(
              addMilliseconds(pool.deal.redemption.end, pool.deal.vestingPeriod.cliff.ms),
              DATE_DETAILED,
            )}`
          : '',
    },
    [PoolTimelineState.vestingPeriod]: {
      active:
        !!pool.deal?.redemption &&
        isWithinInterval(now, {
          start: addMilliseconds(pool.deal.redemption.end, pool.deal.vestingPeriod.cliff.ms),
          end: addMilliseconds(
            pool.deal.redemption.end,
            pool.deal.vestingPeriod.cliff.ms + pool.deal.vestingPeriod.vesting.ms,
          ),
        }),
      isDone:
        !!pool.deal?.redemption &&
        isAfter(
          now,
          addMilliseconds(
            pool.deal.redemption.end,
            pool.deal.vestingPeriod.cliff.ms + pool.deal.vestingPeriod.vesting.ms,
          ),
        ),
      isDefined: true,
      deadline:
        pool.deal?.redemption &&
        isAfter(now, addMilliseconds(pool.deal.redemption.end, pool.deal.vestingPeriod.cliff.ms))
          ? getStepDeadline(
              addMilliseconds(
                pool.deal.redemption.end,
                pool.deal.vestingPeriod.cliff.ms + pool.deal.vestingPeriod.vesting.ms,
              ),
            )
          : undefined,
      deadlineProgress:
        pool.deal?.redemption &&
        isAfter(now, addMilliseconds(pool.deal.redemption.end, pool.deal.vestingPeriod.cliff.ms))
          ? calculateDeadlineProgress(
              addMilliseconds(
                pool.deal.redemption.end,
                pool.deal.vestingPeriod.cliff.ms + pool.deal.vestingPeriod.vesting.ms,
              ),
              addMilliseconds(pool.deal.redemption.end, pool.deal.vestingPeriod.cliff.ms),
            )
          : '0',
      value:
        pool.deal?.redemption &&
        isAfter(now, addMilliseconds(pool.deal.redemption.end, pool.deal.vestingPeriod.cliff.ms))
          ? `Ends ${formatDate(
              addMilliseconds(
                pool.deal.redemption.end,
                pool.deal.vestingPeriod.cliff.ms + pool.deal.vestingPeriod.vesting.ms,
              ),
              DATE_DETAILED,
            )}`
          : '',
    },
  }
}

export default function useAelinPoolStatus(chainId: ChainsValues, poolAddress: string) {
  const { pool: poolResponse, refetch: refetchPool } = useAelinPool(chainId, poolAddress, {
    refreshInterval: ms('30s'),
  })

  const { address } = useWeb3Connection()

  // derive data for UI
  const derivedStatus = useCurrentStatus(poolResponse)
  const userRole = useUserRole(address, poolResponse, derivedStatus)
  const tabs = useUserTabs(poolResponse, derivedStatus, userRole)

  // get info by pool status
  const funding = useFundingStatus(poolResponse, chainId)
  const dealing = useDealingStatus(poolResponse, chainId)
  const proRata = useProRataStatus(poolResponse)
  const timeline = useTimelineStatus(poolResponse)

  return useMemo(
    () => ({
      refetchPool,
      pool: poolResponse,
      userRole,
      funding,
      dealing,
      proRata,
      tabs,
      timeline,
    }),
    [poolResponse, refetchPool, funding, dealing, proRata, userRole, tabs, timeline],
  )
}
