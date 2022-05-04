import { Contents } from '@/src/components/pools/actions/Wrapper'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { MAX_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useERC20Transaction from '@/src/hooks/contracts/useERC20Transaction'
import { GasOptions, useTransactionModal } from '@/src/providers/modalTransactionProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type Props = {
  pool: ParsedAelinPool
  tokenAddress: string
  tokenSymbol: string
  refetchAllowance: () => void
}

export default function Approve({ pool, refetchAllowance, tokenAddress, tokenSymbol }: Props) {
  const { address: poolAddress } = pool
  const { address, isAppConnected } = useWeb3Connection()

  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { estimate, execute } = useERC20Transaction(tokenAddress, 'approve')

  const approveInvestmentToken = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await execute([poolAddress, MAX_BN], txGasOptions)
        if (receipt) {
          refetchAllowance()
        }
      },
      title: `Approve ${tokenSymbol}`,
      estimate: () => estimate([poolAddress, MAX_BN]),
    })
  }

  return (
    <>
      <Contents>
        Before you deposit, the pool needs your permission to transfer your {tokenSymbol}
      </Contents>
      <GradientButton
        disabled={!address || !isAppConnected || isSubmitting}
        onClick={approveInvestmentToken}
      >
        Approve
      </GradientButton>
    </>
  )
}
