import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import ms from 'ms'

import { ChainsValues } from '@/src/constants/chains'
import { MAX_BN, ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useAelinPool from '@/src/hooks/aelin/useAelinPool'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { formatToken } from '@/src/web3/bigNumber'
import {
  AelinPoolState,
  FundingState,
  PoolStatus,
  ProRataState,
  WaitingForDealState,
} from '@/types/AelinPoolStatus'

function useFundingStatus(
  pool: ParsedAelinPool,
  currentStatusType: AelinPoolState,
): FundingState | null {
  const { address } = useWeb3Connection()

  const [allowance, refetch] = useERC20Call(pool.chainId, pool.investmentToken, 'allowance', [
    address || ZERO_ADDRESS,
    pool.address,
  ])

  if (currentStatusType !== AelinPoolState.Funding) {
    return null
  }

  const isCap = pool.poolCap.raw.eq(0)
  const capAmount = pool.poolCap.raw
  const funded = pool.funded.raw
  const maxDepositAllowed = capAmount.sub(funded)

  return {
    state: AelinPoolState.Funding,
    prevStates: [],
    meta: {
      isCap,
      capReached: isCap ? false : capAmount.eq(funded),
      userAllowance: allowance || ZERO_BN,
      refetchAllowance: refetch,
      maxDepositAllowed: {
        raw: isCap ? MAX_BN : maxDepositAllowed,
        formatted: formatToken(maxDepositAllowed, pool.investmentTokenDecimals),
      },
    },
  }
}

function useWaitingForDealStatus(
  pool: ParsedAelinPool,
  currentStatusType: AelinPoolState,
): WaitingForDealState | null {
  const { address } = useWeb3Connection()

  if (currentStatusType !== AelinPoolState.WaitingForDeal) {
    return null
  }

  const isUserSponsor = address?.toLowerCase() === pool.sponsor.toLowerCase()
  const isDealPresent = pool.deal !== undefined

  return {
    state: AelinPoolState.WaitingForDeal,
    prevStates: [AelinPoolState.Funding],
    meta: {
      isUserSponsor,
      isDealPresent,
      showCreateDealForm: isUserSponsor && !isDealPresent,
    },
  }
}

function useProRataStatus(
  pool: ParsedAelinPool,
  currentStatusType: AelinPoolState,
): ProRataState | null {
  if (currentStatusType !== AelinPoolState.ProRata) {
    return null
  }

  return {
    state: AelinPoolState.ProRata,
    prevStates: [AelinPoolState.Funding, AelinPoolState.WaitingForDeal],
    meta: {},
  }
}

function deriveCurrentStatus(pool: ParsedAelinPool): AelinPoolState {
  const now = Date.now()
  if (isBefore(now, pool.purchaseExpiry)) {
    return AelinPoolState.Funding
  }

  if (isAfter(now, pool.purchaseExpiry) && isBefore(now, pool.dealDeadline)) {
    return AelinPoolState.WaitingForDeal
  }

  return AelinPoolState.ProRata
}

export default function useAelinPoolStatus(chainId: ChainsValues, poolAddress: string) {
  const { pool: poolResponse, refetch: refetchPool } = useAelinPool(chainId, poolAddress, {
    refreshInterval: ms('30s'),
  })
  const currentStatusType = deriveCurrentStatus(poolResponse)

  const fundingStatus = useFundingStatus(poolResponse, currentStatusType)
  const waitingForDealStatus = useWaitingForDealStatus(poolResponse, currentStatusType)
  const proRataStatus = useProRataStatus(poolResponse, currentStatusType)

  let currentStatus: PoolStatus | null = null

  switch (currentStatusType) {
    case AelinPoolState.Funding:
      currentStatus = fundingStatus
      break
    case AelinPoolState.WaitingForDeal:
      currentStatus = waitingForDealStatus
      break
    case AelinPoolState.ProRata:
      currentStatus = proRataStatus
      break
    // case AelinPoolState.Closed:
    //   return { refetchPool, currentStatus: null, pool: poolResponse }
  }

  if (!currentStatus) {
    throw new Error('Unable to derive current status')
  }

  return { refetchPool, currentStatus, pool: poolResponse }
}
