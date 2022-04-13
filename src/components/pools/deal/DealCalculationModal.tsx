import React, { ChangeEvent, useState } from 'react'
import styled, { css } from 'styled-components'

import { Modal } from '@/src/components/common/Modal'
import { ButtonPrimary } from '@/src/components/pureStyledComponents/buttons/Button'
import { Textfield } from '@/src/components/pureStyledComponents/form/Textfield'
import { Token } from '@/src/constants/token'

const WidthCSS = css`
  max-width: 100%;
  width: 320px;
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 auto 20px;
  text-align: center;
  ${WidthCSS}
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
      <Description>
        Total Purchase Token ({investmentToken?.symbol}): {investmentTokenAmount}
      </Description>
      Exchange rate: ${dealToken?.symbol} per ${investmentToken?.symbol}
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
      <legend>
        {exchangeRate ? 1 / exchangeRate : 0} {investmentToken?.symbol} = 1 {dealToken?.symbol}
        <br />
        {exchangeRate} {dealToken?.symbol} = 1 {investmentToken?.symbol}
      </legend>
      <br />
      <br />
      {dealToken?.symbol} Total
      <Textfield readOnly type="number" value={dealTokenTotal || undefined} />
      <ButtonPrimary onClick={() => onConfirm(dealTokenTotal)}>OK</ButtonPrimary>
    </Modal>
  )
}

export default DealCalculationModal
