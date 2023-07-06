import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { getAddress, isAddress } from '@ethersproject/address'
import { BigNumber } from 'alchemy-sdk'

import {
  Modal as BaseModal,
  ModalButtonCSS,
  ModalLine,
  ModalText,
} from '@/src/components/common/Modal'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import {
  Textfield as BaseTextField,
  TextfieldState,
} from '@/src/components/pureStyledComponents/form/Textfield'
import { Error } from '@/src/components/pureStyledComponents/text/Error'
import { DISPLAY_DECIMALS, ZERO_ADDRESS } from '@/src/constants/misc'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
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

type Props = {
  symbol: string | undefined
  totalAmount: BigNumber
  underlyingDealTokenDecimals: number | undefined
  onClose: () => void
  onTransfer: (toAddress: string) => void
  isTransferButtonDisabled: boolean
}

const CommonTransferVestingShareModal = ({
  isTransferButtonDisabled,
  onClose,
  onTransfer,
  symbol,
  totalAmount,
  underlyingDealTokenDecimals,
}: Props) => {
  const { address } = useWeb3Connection()

  const [toAddress, setToAddress] = useState('')

  const addressError = useMemo(() => {
    if (!toAddress) {
      return ''
    }

    if (!isAddress(toAddress)) {
      return 'Invalid address'
    }

    if (getAddress(address || ZERO_ADDRESS) === getAddress(toAddress)) {
      return 'Please select address different from yours'
    }
  }, [toAddress, address])

  return (
    <Modal onClose={onClose} size="560px" title="Deal tokens transfer">
      <ModalText>Transfer tokens locked in a vesting schedule to another address</ModalText>
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
      </InputBox>
      <TransferButton
        disabled={isTransferButtonDisabled || !totalAmount || !toAddress || !!addressError}
        onClick={() => onTransfer(toAddress)}
      >
        Transfer
      </TransferButton>
    </Modal>
  )
}

export default CommonTransferVestingShareModal
