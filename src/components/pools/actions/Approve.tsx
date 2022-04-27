import { useState } from 'react'

import { Contents } from '@/src/components/pools/actions/Wrapper'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { MAX_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useERC20Transaction from '@/src/hooks/contracts/useERC20Transaction'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type Props = {
  pool: ParsedAelinPool
  refetchAllowance: () => void
}

export default function Approve({ pool, refetchAllowance }: Props) {
  const { address: poolAddress, investmentToken, investmentTokenSymbol } = pool
  const { address, isAppConnected } = useWeb3Connection()
  const [isLoading, setIsLoading] = useState(false)

  const approve = useERC20Transaction(investmentToken, 'approve')

  const approveInvestmentToken = async () => {
    setIsLoading(true)
    try {
      await approve(poolAddress, MAX_BN)
      refetchAllowance()
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Contents>
        Before you deposit, the pool needs your permission to transfer your {investmentTokenSymbol}
      </Contents>
      <GradientButton
        disabled={!address || !isAppConnected || isLoading}
        onClick={approveInvestmentToken}
      >
        Approve
      </GradientButton>
    </>
  )
}
