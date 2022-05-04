import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import Approve from '@/src/components/pools/actions/Approve'
import HolderDeposit from '@/src/components/pools/actions/HolderDeposit'
import { Wrapper } from '@/src/components/pools/actions/Wrapper'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type Props = {
  pool: ParsedAelinPool
}

const FundDeal: React.FC<Props> = ({ pool, ...restProps }) => {
  const { address } = useWeb3Connection()

  const [allowance, refetch] = useERC20Call(
    pool.chainId,
    pool.deal?.underlyingToken.token || ZERO_ADDRESS,
    'allowance',
    [address || ZERO_ADDRESS, pool.dealAddress || ZERO_ADDRESS],
  )

  return (
    <Wrapper title="Deposit tokens" {...restProps}>
      {(allowance || ZERO_BN).gt(pool.deal?.underlyingToken.dealAmount.raw || ZERO_BN) ? (
        <Approve
          pool={pool}
          refetchAllowance={refetch}
          tokenAddress={pool.deal?.underlyingToken.token || ZERO_ADDRESS}
          tokenSymbol={pool.deal?.underlyingToken.symbol || ''}
        />
      ) : (
        <HolderDeposit pool={pool} />
      )}
    </Wrapper>
  )
}

export default genericSuspense(FundDeal)
