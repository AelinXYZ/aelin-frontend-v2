import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { isAddress } from '@ethersproject/address'
import { BigNumber } from 'alchemy-sdk'

import {
  Modal as BaseModal,
  ModalButtonCSS,
  ModalLine,
  ModalText,
} from '@/src/components/common/Modal'
import { TokenInput as BaseTokenInput } from '@/src/components/form/TokenInput'
import {
  ButtonGradient,
  ButtonPrimaryLight,
} from '@/src/components/pureStyledComponents/buttons/Button'
import {
  Textfield as BaseTextField,
  TextfieldState,
} from '@/src/components/pureStyledComponents/form/Textfield'
import { Error } from '@/src/components/pureStyledComponents/text/Error'
import { BASE_DECIMALS, DISPLAY_DECIMALS } from '@/src/constants/misc'
import { formatToken } from '@/src/web3/bigNumber'

const Modal = styled(BaseModal)`
  .modalCard {
    padding-left: 60px;
    padding-right: 60px;
  }
`
const TransferButton = styled(ButtonGradient)`
  ${ModalButtonCSS}
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  justify-content: space-between;
`

const Text = styled.span`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.2;
`

const Value = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`

const TokensHeld = styled(Row)`
  margin: 0 auto 20px;
`

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  padding: 20px;
  margin: 0 auto 40px;
`

const InputLabel = styled.span`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.3;
`

const Textfield = styled(BaseTextField)`
  width: 320px;
`

const TokenInput = styled(BaseTokenInput)`
  width: 320px !important;
  margin: 0 !important;
`

const PercentsButton = styled(ButtonPrimaryLight)`
  font-size: 0.7rem;
  font-weight: 400;
  line-height: 1.5;
  height: 24px;
  padding: 5px 10px;
`

const TokensToTransfer = styled(Row)`
  margin: 0 auto 6px;
`

type Props = {
  symbol: string | undefined
  totalAmount: BigNumber
  underlyingDealTokenDecimals: number | undefined
  onClose: () => void
  onTransfer: (amount: string, toAddress: string) => void
  isTransferButtonDisabled: boolean
}

enum Percents {
  P25 = '25%',
  P50 = '50%',
  P75 = '75%',
  P100 = '100%',
}

const CommonTransferVestingShareModal = ({
  isTransferButtonDisabled,
  onClose,
  onTransfer,
  symbol,
  totalAmount,
  underlyingDealTokenDecimals,
}: Props) => {
  const [amount, setAmount] = useState('0')
  const [toAddress, setToAddress] = useState('')

  const amountError = useMemo(() => {
    return BigNumber.from(amount === '' ? 0 : amount).gt(totalAmount)
      ? 'Not enough deal tokens held'
      : ''
  }, [amount, totalAmount])

  const addressError = useMemo(() => {
    return toAddress && !isAddress(toAddress) ? 'Invalid address' : ''
  }, [toAddress])

  const setTokensToTransfer = (percents: Percents) => {
    switch (percents) {
      case Percents.P25:
        setAmount(totalAmount.div(4).toString())
        break
      case Percents.P50:
        setAmount(totalAmount.div(4).mul(2).toString())
        break
      case Percents.P75:
        setAmount(totalAmount.div(4).mul(3).toString())
        break
      case Percents.P100:
        setAmount(totalAmount.toString())
        break
    }
  }

  return (
    <Modal onClose={onClose} size="560px" title="Deal tokens transfer">
      <ModalText>Wording TBD</ModalText>
      <ModalLine />
      <TokensHeld>
        <Text>Tokens held in vesting schedule:</Text>
        <Value>
          {formatToken(totalAmount, underlyingDealTokenDecimals, DISPLAY_DECIMALS)} {symbol}
        </Value>
      </TokensHeld>
      <InputBox>
        <InputLabel>Receiver address</InputLabel>
        <Textfield
          maxLength={42}
          onChange={(e) => setToAddress(e.target.value)}
          placeholder="Enter receiver address..."
          status={addressError ? TextfieldState.error : undefined}
          type="text"
          value={toAddress}
        />
        {addressError && <Error margin="0">{addressError}</Error>}
        <InputLabel>Deal tokens to transfer</InputLabel>
        <TokenInput
          decimals={underlyingDealTokenDecimals ?? BASE_DECIMALS}
          error={amountError}
          setValue={setAmount}
          symbol={symbol}
          value={amount}
          withBalance={false}
          withMaxButton={false}
        />
        <Row>
          <PercentsButton onClick={() => setTokensToTransfer(Percents.P25)}>25%</PercentsButton>
          <PercentsButton onClick={() => setTokensToTransfer(Percents.P50)}>50%</PercentsButton>
          <PercentsButton onClick={() => setTokensToTransfer(Percents.P75)}>75%</PercentsButton>
          <PercentsButton onClick={() => setTokensToTransfer(Percents.P100)}>100%</PercentsButton>
        </Row>
      </InputBox>
      <TokensToTransfer>
        <Text>Deal tokens to transfer:</Text>
        <Value>
          {formatToken(amount === '' ? 0 : amount, underlyingDealTokenDecimals, DISPLAY_DECIMALS)}{' '}
          {symbol}
        </Value>
      </TokensToTransfer>
      <TransferButton
        disabled={
          isTransferButtonDisabled || !amount || !toAddress || !!amountError || !!addressError
        }
        onClick={() => onTransfer(amount, toAddress)}
      >
        Transfer
      </TransferButton>
    </Modal>
  )
}

export default CommonTransferVestingShareModal
