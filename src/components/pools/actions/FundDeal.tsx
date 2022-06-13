import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import Approve from '@/src/components/pools/actions/Approve'
import HolderDeposit from '@/src/components/pools/actions/HolderDeposit'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { TextPrimary } from '@/src/components/pureStyledComponents/text/Text'
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

  const releaseFundNote =
    pool.sponsor === pool.deal?.holderAddress &&
    pool.investmentToken === pool.deal.underlyingToken.token
      ? ' As the sponsor and the holder, if you are releasing funds to cancel the pool then do not call this method.'
      : ''

  return (
    <Wrapper title="Fund deal" {...restProps}>
      {(allowance || ZERO_BN).lt(pool.deal?.underlyingToken.dealAmount.raw || ZERO_BN) ? (
        <Approve
          description={`Before funding the deal, you need to approve the pool to transfer your ${pool.deal?.underlyingToken.symbol}. ${releaseFundNote}`}
          refetchAllowance={refetch}
          spender={pool.dealAddress || ZERO_ADDRESS}
          title="Fund deal"
          tokenAddress={pool.deal?.underlyingToken.token || ZERO_ADDRESS}
        />
      ) : (
        <>
          <Contents>
            Deal amount:{' '}
            <TextPrimary>{`${pool.deal?.underlyingToken.dealAmount.formatted} ${pool.deal?.underlyingToken.symbol}`}</TextPrimary>
          </Contents>
          <HolderDeposit pool={pool} />
        </>
      )}
    </Wrapper>
  )
}

export default genericSuspense(FundDeal)
