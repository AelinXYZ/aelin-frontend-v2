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
import { FundingState, PoolState, ProRataState, WaitingForDealState } from '@/types/aelinPool'

function useFundingStatus(pool: ParsedAelinPool): FundingState {
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

function useWaitingForDealStatus(
  pool: ParsedAelinPool,
  chainId: ChainsValues,
): WaitingForDealState {
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

function useProRataStatus(pool: ParsedAelinPool, currentStatusType: PoolState): ProRataState {
  return {}
}

function deriveCurrentStatus(pool: ParsedAelinPool): PoolState {
  const now = Date.now()
  if (isBefore(now, pool.purchaseExpiry)) {
    return PoolState.Funding
  }

  if (isAfter(now, pool.purchaseExpiry) && isBefore(now, pool.dealDeadline)) {
    return PoolState.WaitingForDeal
  }

  return PoolState.ProRata
}

export default function useAelinPoolStatus(chainId: ChainsValues, poolAddress: string) {
  const { pool: poolResponse, refetch: refetchPool } = useAelinPool(chainId, poolAddress, {
    refreshInterval: ms('30s'),
  })
  const currentStatusType = deriveCurrentStatus(poolResponse)

  const fundingStatus = useFundingStatus(poolResponse)
  const waitingForDealStatus = useWaitingForDealStatus(poolResponse, chainId)
  const proRataStatus = useProRataStatus(poolResponse, currentStatusType)

  const currentStatus = useMemo(
    () => ({
      state: currentStatusType,
      fundingStatus,
      waitingForDealStatus,
      proRataStatus,
    }),
    [currentStatusType, fundingStatus, waitingForDealStatus, proRataStatus],
  )

  return { refetchPool, currentStatus, pool: poolResponse }
}
