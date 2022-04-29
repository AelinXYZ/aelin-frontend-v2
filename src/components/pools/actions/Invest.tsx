import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import Approve from '@/src/components/pools/actions/Approve'
import Deposit from '@/src/components/pools/actions/Deposit'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { Funding } from '@/types/aelinPool'

type Props = {
  pool: ParsedAelinPool
  poolHelpers: Funding
}

const Invest: React.FC<Props> = ({ pool, poolHelpers, ...restProps }) => {
  const { address } = useWeb3Connection()
  const [allowance, refetchAllowance] = useERC20Call(
    pool.chainId,
    pool.investmentToken,
    'allowance',
    [address || ZERO_ADDRESS, pool.address],
  )

  return (
    <Wrapper title="Deposit tokens" {...restProps}>
      {!allowance ? (
        <Contents>There was an error, try again!</Contents>
      ) : poolHelpers.capReached ? (
        <Contents>Max cap reached</Contents>
      ) : allowance.gt(ZERO_ADDRESS) ? (
        <Deposit pool={pool} poolHelpers={poolHelpers} />
      ) : (
        <Approve pool={pool} refetchAllowance={refetchAllowance} />
      )}
    </Wrapper>
  )
}

export default genericSuspense(Invest)
