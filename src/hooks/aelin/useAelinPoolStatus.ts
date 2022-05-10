import { useMemo } from 'react'

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import uniq from 'lodash/uniq'
import ms from 'ms'

import { ChainsValues } from '@/src/constants/chains'
import { MAX_BN, ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useAelinPool from '@/src/hooks/aelin/useAelinPool'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useProRataAmount } from '@/src/hooks/aelin/useProRataAmount'
import { useUserAllocationStat } from '@/src/hooks/aelin/useUserAllocationStats'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
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
  const { data: userAllocationStatRes, refetch: refetchUserWithdrawn } = useUserAllocationStat(
    pool.address,
    chainId,
  )
  const { maxProRataAmountBalance, refetchMaxProRataAmountBalance } = useProRataAmount(pool)

  const userAmountWithdrawn = userAllocationStatRes?.userAllocationStat?.totalWithdrawn || ZERO_BN

  return {
    refetchUserStats: () => {
      refetchUserWithdrawn()
      refetchMaxProRataAmountBalance()
    },
    userTotalWithdrawn: {
      raw: userAmountWithdrawn,
      formatted: formatToken(userAmountWithdrawn, pool.investmentTokenDecimals),
    },
    userProRataAllocation: {
      raw: maxProRataAmountBalance as BigNumber,
      formatted:
        formatToken(
          (maxProRataAmountBalance as BigNumberish) || ZERO_BN,
          pool.investmentTokenDecimals,
        ) || '0',
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

function useUserRole(walletAddress: string | null, pool: ParsedAelinPool): UserRole {
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
      const isSponsor = userRole === UserRole.Sponsor
      const now = new Date()

      if (isSponsor && !pool.dealAddress) {
        actions.push(PoolAction.CreateDeal)
      }

      if (
        !pool.dealAddress ||
        (pool.dealAddress && !pool.deal?.holderAlreadyDeposited && isBefore(now, pool.dealDeadline))
      ) {
        actions.push(PoolAction.AwaitingForDeal)
      }

      if (isAfter(now, pool.dealDeadline)) {
        const holderDepositExpired = pool.deal && isAfter(now, pool.deal.holderFundingExpiration)

        if (
          isSponsor &&
          pool.deal &&
          !pool.deal.holderAlreadyDeposited &&
          holderDepositExpired &&
          pool.dealsCreated < 5
        ) {
          actions.push(PoolAction.CreateDeal)
        }

        actions.push(PoolAction.Withdraw)
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
    }),
    [poolResponse, refetchPool, derivedStatus, proRata, funding, dealing, userRole, tabs, actions],
  )
}
