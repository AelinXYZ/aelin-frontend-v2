import { Contents } from '@/src/components/pools/actions/Wrapper'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { MAX_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useERC20Transaction from '@/src/hooks/contracts/useERC20Transaction'
import { GasOptions, useModalTransaction } from '@/src/providers/modalTransactionProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type Props = {
  pool: ParsedAelinPool
  refetchAllowance: () => void
}

export default function Approve({ pool, refetchAllowance }: Props) {
  const { address: poolAddress, investmentToken, investmentTokenSymbol } = pool
  const { address, isAppConnected } = useWeb3Connection()

  const { isSubmitting, setConfigAndOpenModal } = useModalTransaction()

  const { estimate, execute } = useERC20Transaction(investmentToken, 'approve')

  const approveInvestmentToken = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await execute([poolAddress, MAX_BN], txGasOptions)
        if (receipt) {
          refetchAllowance()
        }
      },
      title: `Approve ${investmentTokenSymbol}`,
      estimate: () => estimate([poolAddress, MAX_BN]),
    })
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
    </>
  )
}
