import { genericSuspense } from '@/src/components/safeSuspense'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import ApprovePool from '@/src/page_helpers/ApprovePool'
import DepositPool from '@/src/page_helpers/DepositPool'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { FundingState } from '@/src/utils/getAelinPoolCurrentStatus'

type Props = {
  pool: ParsedAelinPool
  poolHelpers: FundingState
}

function FundingActions({ pool, poolHelpers }: Props) {
  const { address } = useWeb3Connection()
  const [allowance, refetch] = useERC20Call(pool.chainId, pool.investmentToken, 'allowance', [
    address || ZERO_ADDRESS,
    pool.address,
  ])

  if (!allowance) {
    return <div>There was an error, try again!</div>
  }

  if (poolHelpers.meta.capReached) {
    return <div>Max cap reached</div>
  }

  if (allowance.gt(ZERO_ADDRESS)) {
    return <DepositPool pool={pool} />
  }

  return <ApprovePool pool={pool} refetchAllowance={refetch} />
}

export default genericSuspense(FundingActions)
