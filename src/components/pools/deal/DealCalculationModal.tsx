import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'

import { Modal, ModalButtonCSS, ModalText, WidthLimitsCSS } from '@/src/components/common/Modal'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { Textfield as BaseTextField } from '@/src/components/pureStyledComponents/form/Textfield'
import { Token } from '@/src/constants/token'

const Text = styled(ModalText)`
  margin-bottom: 40px;
`

const TokenValue = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`

const Textfield = styled(BaseTextField)`
  ${WidthLimitsCSS}
`

const Label = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.4rem;
  line-height: 1.2;
  margin: 0 0 8px;
  text-align: left;
  ${WidthLimitsCSS}
`

const Note = styled(Label)`
  text-align: right;
  margin-bottom: 20px;
  margin-top: 8px;
`

const Button = styled(GradientButton)`
  ${ModalButtonCSS}
`

export const DealCalculationModal: React.FC<{
  dealToken: Token
  investmentToken: Token
  dealTokenAmount: string
  investmentTokenAmount: string
  onClose: () => void
  onConfirm: (dealTokenTotal: number | undefined) => void
}> = ({
  dealToken,
  dealTokenAmount,
  investmentToken,
  investmentTokenAmount,
  onClose,
  onConfirm,
}) => {
  const [dealTokenTotal, setDealTokenTotal] = useState<number | undefined>(undefined)
  const [exchangeRate, setExchangeRate] = useState<number | undefined>(undefined)

  const calcDealTokenTotal = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    setDealTokenTotal(Number(dealTokenAmount) * Number(value))
  }

  return (
    <Modal onClose={onClose} title="Deal Calculation">
      <Text>
        Total Purchase Token ({investmentToken?.symbol}):{' '}
        <TokenValue>{investmentTokenAmount}</TokenValue>
      </Text>
      <Label>
        Exchange rate: {dealToken?.symbol} per {investmentToken?.symbol}
      </Label>
      <Textfield
        onChange={(e) => {
          setExchangeRate(Number(e.target.value))
          calcDealTokenTotal(e)
        }}
        placeholder="Enter exchange rate..."
        step={0.1}
        type="number"
        value={exchangeRate || undefined}
      />
      <Note>
        ({exchangeRate ? 1 / exchangeRate : 0} {investmentToken?.symbol} = 1 {dealToken?.symbol})
        {/* {exchangeRate} {dealToken?.symbol} = 1 {investmentToken?.symbol} */}
      </Note>
      <Label>{dealToken?.symbol} Total</Label>
      <Textfield readOnly type="number" value={dealTokenTotal || undefined} />
      <Button onClick={() => onConfirm(dealTokenTotal)}>OK</Button>
    </Modal>
  )
}

export default DealCalculationModal
