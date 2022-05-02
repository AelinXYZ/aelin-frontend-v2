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
  const [isLoading, setIsLoading] = useState(false)

  const { estimate, getModalTransaction, setShowModalTransaction } = useERC20TransactionWithModal(
    investmentToken,
    'approve',
  )

  const approveInvestmentToken = async () => {
    setIsLoading(true)
    setShowModalTransaction(true)
    try {
      await estimate([poolAddress, MAX_BN])
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
      {getModalTransaction(
        `Approve ${investmentTokenSymbol}`,
        () => {
          setIsLoading(false)
          refetchAllowance()
        },
        () => {
          setIsLoading(false)
        },
      )}
    </>
  )
}
