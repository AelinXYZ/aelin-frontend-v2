import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import Wei, { wei } from '@synthetixio/wei'

import { Modal, ModalButtonCSS, ModalText, WidthLimitsCSS } from '@/src/components/common/Modal'
import {
  ButtonPrimaryLightSm,
  GradientButton,
} from '@/src/components/pureStyledComponents/buttons/Button'
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
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  dealTokenAmount: Wei
  investmentTokenAmount: Wei
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
  const [dealTokenTotal, setDealTokenTotal] = useState<Wei>(dealTokenAmount)
  const [rateIsInverted, setRateIsInverted] = useState<boolean>(false)

  const [exchangeRate, setExchangeRate] = useState<number>(
    dealTokenAmount.div(investmentTokenAmount).toNumber(),
  )

  const ratePair = useMemo(() => {
    return rateIsInverted
      ? `${investmentToken.symbol} per ${dealToken.symbol}`
      : `${dealToken.symbol} per ${investmentToken.symbol}`
  }, [dealToken.symbol, investmentToken.symbol, rateIsInverted])

  const rateLabel = useMemo(() => {
    return rateIsInverted
      ? `1 ${dealToken.symbol} = ${exchangeRate} ${investmentToken.symbol}`
      : `1 ${investmentToken.symbol} = ${exchangeRate} ${dealToken.symbol}`
  }, [dealToken.symbol, exchangeRate, investmentToken.symbol, rateIsInverted])

  useEffect(() => {
    if (rateIsInverted) {
      //setDealTokenTotal()
    } else {
      setDealTokenTotal(investmentTokenAmount.mul(wei(exchangeRate, investmentToken.decimals)))
    }
  }, [
    dealTokenAmount,
    exchangeRate,
    investmentToken.decimals,
    investmentTokenAmount,
    rateIsInverted,
  ])

  useEffect(() => {
    if (rateIsInverted) {
      setExchangeRate(investmentTokenAmount.div(dealTokenAmount).toNumber())
    } else {
      setExchangeRate(dealTokenAmount.div(investmentTokenAmount).toNumber())
    }
  }, [dealTokenAmount, exchangeRate, investmentTokenAmount, rateIsInverted])

  return (
    <Modal onClose={onClose} title="Deal Calculation">
      <Text>
        Total Purchase Token ({investmentToken?.symbol}):{' '}
        <TokenValue>{investmentTokenAmount.toNumber()}</TokenValue>
      </Text>
      <Label>
        Exchange rate: {ratePair}
        <ButtonPrimaryLightSm
          onClick={() => {
            setExchangeRate(0)
            setRateIsInverted(!rateIsInverted)
          }}
        >
          Invert
        </ButtonPrimaryLightSm>
      </Label>
      <Textfield
        onChange={(e) => {
          setExchangeRate(Number(e.target.value))
        }}
        placeholder="Enter exchange rate..."
        step={0.1}
        type="number"
        value={exchangeRate || undefined}
      />
      <Note>{rateLabel}</Note>
      <Label>{dealToken?.symbol} Total</Label>
      <Textfield readOnly type="number" value={dealTokenTotal.toNumber()} />
      <Button onClick={() => onConfirm(dealTokenTotal.toNumber())}>OK</Button>
    </Modal>
  )
}

export default DealCalculationModal
