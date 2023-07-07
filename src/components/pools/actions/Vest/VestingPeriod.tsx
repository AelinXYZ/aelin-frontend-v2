import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import {
  ButtonGradient,
  ButtonPrimaryLight,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { TextPrimary } from '@/src/components/pureStyledComponents/text/Text'
import { DISPLAY_DECIMALS } from '@/src/constants/misc'
import { formatToken } from '@/src/web3/bigNumber'

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  width: 100%;
  margin-top: 15px;
  padding-left: 25px;
  padding-right: 25px;
`

const TransferButton = styled(ButtonPrimaryLight)`
  width: 100%;
`

const VestButton = styled(ButtonGradient)`
  width: 100%;
`

type VestingPeriodProps = {
  amountToVest: BigNumber | null
  handleTransfer: () => void
  handleVest: () => void
  isTransferButtonDisabled: boolean
  isVestButtonDisabled: boolean
  symbol: string | undefined
  totalVested: BigNumber
  totalAmount: BigNumber
  underlyingDealTokenDecimals: number | undefined
}

function VestingPeriod({
  amountToVest,
  handleTransfer,
  handleVest,
  isTransferButtonDisabled,
  isVestButtonDisabled,
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
          DISPLAY_DECIMALS,
        )} ${symbol}`}</TextPrimary>
        <br />
        Amount to vest:{' '}
        <TextPrimary>{`${
          BigNumber.isBigNumber(amountToVest)
            ? `${formatToken(
                amountToVest,
                underlyingDealTokenDecimals,
                DISPLAY_DECIMALS,
              )} ${symbol}`
            : ''
        }`}</TextPrimary>
        <br />
        Total vested:{' '}
        <TextPrimary>{`${formatToken(
          totalVested,
          underlyingDealTokenDecimals,
          DISPLAY_DECIMALS,
        )} ${symbol}`}</TextPrimary>
      </Contents>
      <ButtonsWrapper>
        <VestButton disabled={isVestButtonDisabled} onClick={handleVest}>
          Vest
        </VestButton>
        <TransferButton disabled={isTransferButtonDisabled} onClick={handleTransfer}>
          Transfer
        </TransferButton>
      </ButtonsWrapper>
    </Wrapper>
  )
}

export default VestingPeriod
