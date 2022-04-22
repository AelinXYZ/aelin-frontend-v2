import { useMemo } from 'react'

import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import ms from 'ms'

import { ChainsValues } from '@/src/constants/chains'
import { MAX_BN, ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useAelinPool from '@/src/hooks/aelin/useAelinPool'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { formatToken } from '@/src/web3/bigNumber'
import { Funding, PoolStatus, ProRata, UserRole, WaitingForDeal } from '@/types/aelinPool'

function useFundingStatus(pool: ParsedAelinPool): Funding {
  const { address } = useWeb3Connection()

  const [allowance, refetch] = useERC20Call(pool.chainId, pool.investmentToken, 'allowance', [
    address || ZERO_ADDRESS,
    pool.address,
  ])

  const isCap = pool.poolCap.raw.eq(0)
  const capAmount = pool.poolCap.raw
  const funded = pool.funded.raw
  const maxDepositAllowed = capAmount.sub(funded)

  return {
    isCap,
    capReached: isCap ? false : capAmount.eq(funded),
    userAllowance: allowance || ZERO_BN,
    refetchAllowance: refetch,
    maxDepositAllowed: {
      raw: isCap ? MAX_BN : maxDepositAllowed,
      formatted: formatToken(maxDepositAllowed, pool.investmentTokenDecimals),
    },
  }
}

function useDealingStatus(pool: ParsedAelinPool, chainId: ChainsValues): WaitingForDeal {
  const { address } = useWeb3Connection()
  const allSDK = getAllGqlSDK()
  const { useUserAllocationStat } = allSDK[chainId]
  const { data: userAllocationStatRes } = useUserAllocationStat({
    id: `${(address || ZERO_ADDRESS).toLowerCase()}-${pool.dealAddress}`,
  })

  const isUserSponsor = address?.toLowerCase() === pool.sponsor.toLowerCase()
  const isDealPresent = pool.deal !== undefined

  const userProRataAllocation =
    userAllocationStatRes?.userAllocationStat?.remainingProRataAllocation || ZERO_BN
  const userAmountWithdrawn = userAllocationStatRes?.userAllocationStat?.totalWithdrawn || ZERO_BN

  return {
    userTotalWithdrawn: {
      raw: userProRataAllocation,
      formatted: formatToken(userProRataAllocation, pool.investmentTokenDecimals),
    },
    userProRataAllocation: {
      raw: userAmountWithdrawn,
      formatted: formatToken(userAmountWithdrawn, pool.investmentTokenDecimals),
    },
    isUserSponsor,
    isDealPresent,
    showCreateDealForm: isUserSponsor && !isDealPresent,
  }
}

function useProRataStatus(pool: ParsedAelinPool): ProRata {
  return {}
}

type DerivedStatus = {
  current: PoolStatus
  history: PoolStatus[]
}

function deriveStatus(pool: ParsedAelinPool): DerivedStatus {
  const now = Date.now()

  // funding
  if (isBefore(now, pool.purchaseExpiry)) {
    return {
      current: PoolStatus.Funding,
      history: [PoolStatus.Funding],
    }
  }

  // dealing
  if (isAfter(now, pool.purchaseExpiry) && isBefore(now, pool.dealDeadline)) {
    return {
      current: PoolStatus.Dealing,
      history: [PoolStatus.Funding, PoolStatus.Dealing],
    }
  }

  // pro-rata
  return {
    current: PoolStatus.ProRata,
    history: [PoolStatus.Funding, PoolStatus.Dealing, PoolStatus.ProRata],
  }
}

function deriveUserRole(walletAddress: string | null, pool: ParsedAelinPool): UserRole {
  if (!walletAddress) {
    return UserRole.Visitor
  }

  if (walletAddress === pool.sponsor) {
    return UserRole.Sponsor
  }

  if (walletAddress === pool.deal?.holderAddress) {
    return UserRole.Investor
  }

  return UserRole.Visitor
}

function deriveUserTabs(
  userRole: UserRole,
  pool: ParsedAelinPool,
  derivedStatus: DerivedStatus,
): PoolStatus[] {
  const currentStatus = derivedStatus.current

  if (currentStatus === PoolStatus.Funding) {
    return [PoolStatus.Funding]
  }

  if (currentStatus === PoolStatus.Dealing) {
    return pool.dealAddress ? [PoolStatus.Funding, PoolStatus.Dealing] : [PoolStatus.Funding]
  }

  return [PoolStatus.Funding, PoolStatus.Dealing]
}

export default function useAelinPoolStatus(chainId: ChainsValues, poolAddress: string) {
  const { pool: poolResponse, refetch: refetchPool } = useAelinPool(chainId, poolAddress, {
    refreshInterval: ms('30s'),
  })
  const { address } = useWeb3Connection()

  const derivedStatus = deriveStatus(poolResponse)
  const userRole = deriveUserRole(address, poolResponse)
  const tabs = deriveUserTabs(userRole, poolResponse, derivedStatus)

  const funding = useFundingStatus(poolResponse)
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
    }),
    [poolResponse, refetchPool, derivedStatus, funding, dealing, proRata, userRole, tabs],
  )
}
