import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { TextPrimary } from '@/src/components/pureStyledComponents/text/Text'
import { formatToken } from '@/src/web3/bigNumber'

type VestingCompletedProps = {
  symbol: string | undefined
  totalVested: string
  underlyingDealTokenDecimals: number | undefined
}

function VestingCompleted({
  symbol,
  totalVested,
  underlyingDealTokenDecimals,
}: VestingCompletedProps) {
  return (
    <Wrapper title={'Vesting Completed'}>
      <Contents>All your deals tokens have been vested</Contents>
      <Contents>
        Total Vested:{' '}
        <TextPrimary>{`${formatToken(
          totalVested,
          underlyingDealTokenDecimals,
        )} ${symbol}`}</TextPrimary>
      </Contents>
    </Wrapper>
  )
}

export default VestingCompleted
