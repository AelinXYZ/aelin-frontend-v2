import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import ApprovePool from '@/src/components/pools/ApprovePool'
import DepositPool from '@/src/components/pools/DepositPool'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
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

  return !allowance ? (
    <>There was an error, try again!</>
  ) : poolHelpers.meta.capReached ? (
    <>Max cap reached</>
  ) : allowance.gt(ZERO_ADDRESS) ? (
    <DepositPool pool={pool} poolHelpers={poolHelpers} />
  ) : (
    <ApprovePool pool={pool} refetchAllowance={refetch} />
  )
}

export default genericSuspense(FundingActions)
