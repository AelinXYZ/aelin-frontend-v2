import { useState } from 'react'

import { Contents } from '@/src/components/pools/actions/Wrapper'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { MAX_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useERC20Transaction, {
  useERC20TransactionWithModal,
} from '@/src/hooks/contracts/useERC20Transaction'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type Props = {
  pool: ParsedAelinPool
  refetchAllowance: () => void
}

export default function Approve({ pool, refetchAllowance }: Props) {
  const { address: poolAddress, investmentToken, investmentTokenSymbol } = pool
  const { address, isAppConnected } = useWeb3Connection()

  const { estimate, getModalTransaction, isSubmitting } = useERC20TransactionWithModal(
    investmentToken,
    'approve',
  )

  const approveInvestmentToken = async () => {
    try {
      await estimate([poolAddress, MAX_BN])
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Contents>
        Before you deposit, the pool needs your permission to transfer your {investmentTokenSymbol}
      </Contents>
      <GradientButton
        disabled={!address || !isAppConnected || isSubmitting}
        onClick={approveInvestmentToken}
      >
        Approve
      </GradientButton>
      {getModalTransaction(`Approve ${investmentTokenSymbol}`, () => {
        refetchAllowance()
      })}
    </>
  )
}
