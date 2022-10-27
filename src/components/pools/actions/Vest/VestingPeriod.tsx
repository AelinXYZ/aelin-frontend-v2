import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { TextPrimary } from '@/src/components/pureStyledComponents/text/Text'
import { formatToken } from '@/src/web3/bigNumber'

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 15px;
`

type VestingPeriodProps = {
  amountToVest: BigNumber | null
  handleVest: () => void
  isButtonDisabled: boolean
  symbol: string | undefined
  totalVested: BigNumber
  totalAmount: BigNumber
  underlyingDealTokenDecimals: number | undefined
}

function VestingPeriod({
  amountToVest,
  handleVest,
  isButtonDisabled,
  symbol,
  totalAmount,
  totalVested,
  underlyingDealTokenDecimals,
}: VestingPeriodProps) {
  return (
    <Wrapper title={'Vesting Schedule'}>
      <Contents style={{ marginBottom: '18px' }}>Your deal tokens can be vested.</Contents>
      <Contents>
        My deal total:{' '}
        <TextPrimary>{`${formatToken(
          totalAmount,
          underlyingDealTokenDecimals,
        )} ${symbol}`}</TextPrimary>
        <br />
        Amount to vest:{' '}
        <TextPrimary>{`${
          BigNumber.isBigNumber(amountToVest)
            ? `${formatToken(amountToVest, underlyingDealTokenDecimals)} ${symbol}`
            : ''
        }`}</TextPrimary>
        <br />
        Total vested:{' '}
        <TextPrimary>{`${formatToken(
          totalVested,
          underlyingDealTokenDecimals,
        )} ${symbol}`}</TextPrimary>
      </Contents>
      <ButtonsWrapper>
        <ButtonGradient disabled={isButtonDisabled} onClick={handleVest}>
          Vest
        </ButtonGradient>
      </ButtonsWrapper>
    </Wrapper>
  )
}

export default VestingPeriod
