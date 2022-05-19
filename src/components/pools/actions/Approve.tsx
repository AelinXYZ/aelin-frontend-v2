import { Contents } from '@/src/components/pools/actions/Wrapper'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { MAX_BN } from '@/src/constants/misc'
import useERC20Transaction from '@/src/hooks/contracts/useERC20Transaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type Props = {
  tokenAddress: string
  spender: string
  title: string
  description: string
  refetchAllowance: () => void
}

export default function Approve({
  description,
  refetchAllowance,
  spender,
  title,
  tokenAddress,
}: Props) {
  const { address, isAppConnected } = useWeb3Connection()

  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { estimate, execute: approve } = useERC20Transaction(tokenAddress, 'approve')

  const approveInvestmentToken = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await approve([spender, MAX_BN], txGasOptions)
        if (receipt) {
          refetchAllowance()
        }
      },
      title: `${title}`,
      estimate: () => estimate([spender, MAX_BN]),
    })
  }

  return (
    <>
      <Contents>{description}</Contents>
      <GradientButton
        disabled={!address || !isAppConnected || isSubmitting}
        onClick={approveInvestmentToken}
      >
        Approve
      </GradientButton>
    </>
  )
}
