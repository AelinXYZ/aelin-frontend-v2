import { useMemo } from 'react'

import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useUserAllocationStats } from '@/src/hooks/aelin/useUserAllocationStats'
import { useAelinPoolCallMultiple } from '@/src/hooks/contracts/useAelinPoolCall'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { formatToken } from '@/src/web3/bigNumber'

export default function useAelinDealUserStats(pool: ParsedAelinPool) {
  const { address } = useWeb3Connection()
  const walletAddress = address || ZERO_ADDRESS
  const { data: userAllocationStats, refetch: refetchUserAllocationStats } = useUserAllocationStats(
    pool.address,
    pool.chainId,
    pool.investmentTokenDecimals,
  )

  const [data, refetchPool] = useAelinPoolCallMultiple(pool.chainId, pool.address, [
    { method: 'maxProRataAmount', params: [walletAddress] },
    { method: 'balanceOf', params: [walletAddress] },
    { method: 'purchaseTokenTotalForDeal', params: [] },
    { method: 'totalAmountAccepted', params: [] },
  ])

  return useMemo(() => {
    const maxProRataAmountBalance = data[0] || ZERO_BN
    const safeWalletPoolBalance = data[1] || ZERO_BN
    const maxPurchaseDealAllowed = data[2] || ZERO_BN
    const totalAmountAccepted = data[3] || ZERO_BN

    const userAmountWithdrawn = userAllocationStats?.totalWithdrawn || ZERO_BN

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
        refetchUserAllocationStats()
        refetchPool()
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
  }, [
    data,
    pool.deal?.redemption?.stage,
    pool.investmentTokenDecimals,
    refetchPool,
    refetchUserAllocationStats,
    userAllocationStats?.totalWithdrawn,
  ])
}
