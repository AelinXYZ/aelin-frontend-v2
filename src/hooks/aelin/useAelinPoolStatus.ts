import { useMemo } from 'react'

import { addMilliseconds } from 'date-fns'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import isWithinInterval from 'date-fns/isWithinInterval'
import uniq from 'lodash/uniq'
import ms from 'ms'

import { ChainsValues } from '@/src/constants/chains'
import { MAX_BN, ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
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
  Funding,
  PoolAction,
  PoolStatus,
  ProRata,
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

type DerivedStatus = {
  current: PoolStatus
  history: PoolStatus[]
}

function useCurrentStatus(pool: ParsedAelinPool): DerivedStatus {
  return useMemo(() => {
    const now = Date.now()

    // funding
    if (isBefore(now, pool.purchaseExpiry)) {
      return {
        current: PoolStatus.Funding,
        history: [PoolStatus.Funding],
      }
    }

    // Seeking deal
    if (isAfter(now, pool.purchaseExpiry) && !pool.deal?.holderAlreadyDeposited) {
      return {
        current: PoolStatus.SeekingDeal,
        history: [PoolStatus.Funding, PoolStatus.SeekingDeal],
      }
    }

    // Dealing
    // isAfter(now, pool.dealDeadline)
    // isBefore(now, pool.dealDeadline)
    if (
      pool.deal &&
      pool.deal.holderAlreadyDeposited &&
      pool.deal.redemption &&
      isBefore(now, pool.deal.redemption?.end)
      //isAfter(now, pool.deal?.redemption?.start) &&
      // isBefore(now, pool.deal?.redemption?.end)
    ) {
      return {
        current: PoolStatus.DealPresented,
        history: [PoolStatus.Funding, PoolStatus.SeekingDeal, PoolStatus.DealPresented],
      }
    }

    // Vesting
    if (
      pool.deal &&
      pool.deal.holderAlreadyDeposited &&
      pool.deal.redemption &&
      isAfter(now, pool.deal.redemption?.end) &&
      pool.deal.vestingPeriod.end &&
      isBefore(now, pool.deal.vestingPeriod.end)
    ) {
      return {
        current: PoolStatus.Vesting,
        history: [
          PoolStatus.Funding,
          PoolStatus.SeekingDeal,
          PoolStatus.DealPresented,
          PoolStatus.Vesting,
        ],
      }
    }

    // TODO: Handle different states of closed
    return {
      current: PoolStatus.Closed,
      history: [
        PoolStatus.Funding,
        // PoolStatus.SeekingDeal,
        // PoolStatus.DealPresented,
        // PoolStatus.Vesting,
        // PoolStatus.Closed,
      ],
    }
  }, [pool])
}

export function useUserRole(walletAddress: string | null, pool: ParsedAelinPool): UserRole {
  return useMemo(() => {
    if (!walletAddress) {
      return UserRole.Visitor
    }

    const wa = walletAddress.toLowerCase()
    if (wa === pool.sponsor) {
      return UserRole.Sponsor
    }

    if (wa === pool.deal?.holderAddress) {
      return UserRole.Holder
    }

    return UserRole.Investor
  }, [walletAddress, pool])
}

function useUserTabs(pool: ParsedAelinPool, derivedStatus: DerivedStatus): PoolStatus[] {
  const { history } = derivedStatus
  return useMemo(() => {
    const tabs: PoolStatus[] = [PoolStatus.Funding]

    if (history.includes(PoolStatus.DealPresented)) {
      // only show dealInformation if the deal was funded by the holder
      if (pool.deal?.holderAlreadyDeposited) {
        tabs.push(PoolStatus.DealPresented)
      }
    }

    if (history.includes(PoolStatus.Vesting)) {
      tabs.push(PoolStatus.Vesting)
    }

    return tabs
  }, [pool, history])
}

function useUserActions(
  userRole: UserRole,
  pool: ParsedAelinPool,
  derivedStatus: DerivedStatus,
): PoolAction[] {
  const currentStatus = derivedStatus.current

  return useMemo(() => {
    const now = new Date()

    // Funding
    if (currentStatus === PoolStatus.Funding) {
      return [PoolAction.Invest]
    }

    // Seeking Deal
    if (currentStatus === PoolStatus.SeekingDeal) {
      const actions: PoolAction[] = []
      if (userRole === UserRole.Sponsor && !pool.dealAddress) {
        actions.push(PoolAction.CreateDeal)
      }

      if (!pool.dealAddress) {
        actions.push(PoolAction.AwaitingForDeal)
      }

      if (isAfter(now, pool.dealDeadline)) {
        actions.push(PoolAction.Withdraw)

        // if(sponsor && !accepts) {
        //   create another deal
        // }
      }

      if (userRole === UserRole.Holder && pool.deal && !pool.deal.holderAlreadyDeposited) {
        actions.push(PoolAction.FundDeal)
      }

      return uniq(actions)
    }

    // Deal Presented
    if (currentStatus === PoolStatus.DealPresented) {
      const actions: PoolAction[] = []

      if (pool.deal) {
        if (pool.deal.redemption && isBefore(now, pool.deal.redemption?.end)) {
          actions.push(PoolAction.AcceptDeal)
        }

        if (isAfter(now, pool.deal.holderFundingExpiration)) {
          actions.push(PoolAction.Withdraw)
        }

        if (pool.deal.holderAlreadyDeposited) {
          actions.push(PoolAction.Withdraw)
        }
      }

      // TODO: override deal when is expired and amount of deals presented is < 5

      return uniq(actions)
    }

    if (currentStatus === PoolStatus.Closed) {
      return [PoolAction.Withdraw]
    }

    if (currentStatus === PoolStatus.Vesting) {
      return [PoolAction.Withdraw]
    }

    return []
  }, [userRole, currentStatus, pool])
}

export type TimelineSteps = {
  [key in PoolTimelineState as number]?: {
    active: boolean
    isDone: boolean
    value?: string
    deadline?: string
    deadlineProgress?: string
    isDefined?: boolean
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
        ? getStepDeadline(
            pool.deal.holderFundingExpiration,
            pool.deal.holderAlreadyDeposited && pool.deal.fundedAt
              ? `Funded ${formatDate(pool.deal.fundedAt, DATE_DETAILED)}`
              : undefined,
          )
        : undefined,
      deadlineProgress: pool.deal
        ? pool.deal.holderAlreadyDeposited
          ? '100'
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
    shouldRetryOnError: true,
    errorRetryInterval: ms('20s'),
    errorRetryCount: 10,
  })

  const { address } = useWeb3Connection()

  // derive data for UI
  const derivedStatus = useCurrentStatus(poolResponse)
  const userRole = useUserRole(address, poolResponse)
  const tabs = useUserTabs(poolResponse, derivedStatus)
  const actions = useUserActions(userRole, poolResponse, derivedStatus)

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
      ...derivedStatus,
      funding,
      dealing,
      proRata,
      tabs,
      actions,
      timeline,
    }),
    [
      poolResponse,
      refetchPool,
      derivedStatus,
      funding,
      dealing,
      proRata,
      userRole,
      tabs,
      actions,
      timeline,
    ],
  )
}
