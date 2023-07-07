import { BigNumber } from '@ethersproject/bignumber'

import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { TextPrimary } from '@/src/components/pureStyledComponents/text/Text'
import { DISPLAY_DECIMALS } from '@/src/constants/misc'
import { formatToken } from '@/src/web3/bigNumber'

type VestingCompletedProps = {
  symbol: string | undefined
  totalVested: BigNumber
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
      <br />
      <Contents>
        Total Vested:{' '}
        <TextPrimary>{`${formatToken(
          totalVested,
          underlyingDealTokenDecimals,
          DISPLAY_DECIMALS,
        )} ${symbol}`}</TextPrimary>
      </Contents>
    </Wrapper>
  )
}

export default VestingCompleted
