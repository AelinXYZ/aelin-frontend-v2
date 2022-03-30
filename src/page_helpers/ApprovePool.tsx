import { ButtonPrimary } from '@/src/components/pureStyledComponents/buttons/Button'
import { MAX_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useERC20Transaction from '@/src/hooks/contracts/useERC20Transaction'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type Props = {
  pool: ParsedAelinPool
  refetchAllowance: () => void
}
export default function ApprovePool({ pool, refetchAllowance }: Props) {
  const { address: poolAddress, investmentToken } = pool
  const { address, isAppConnected } = useWeb3Connection()

  const approve = useERC20Transaction(investmentToken, 'approve')

  const approveInvestmentToken = async () => {
    await approve(poolAddress, MAX_BN)
    refetchAllowance()
  }

  return (
    <>
      <ButtonPrimary disabled={!address || !isAppConnected} onClick={approveInvestmentToken}>
        Approve
      </ButtonPrimary>
    </>
  )
}
