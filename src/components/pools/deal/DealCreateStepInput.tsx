import { HTMLAttributes, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { LabeledRadioButton } from '@/src/components/form/LabeledRadioButton'
import { HMSInput } from '@/src/components/pools/common/HMSInput'
import TokenDropdown from '@/src/components/pools/common/TokenDropdown'
import { ButtonPrimaryLight } from '@/src/components/pureStyledComponents/buttons/Button'
import { Textfield as BaseTextField } from '@/src/components/pureStyledComponents/form/Textfield'
import {
  CreateDealState,
  CreateDealSteps,
  createDealConfig,
} from '@/src/hooks/aelin/useAelinCreateDeal'

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 100%;
`

const TextfieldWide = styled(BaseTextField)`
  max-width: 100%;
  width: 360px;
`

const TextfieldNarrow = styled(BaseTextField)`
  max-width: 100%;
  width: 220px;
`

const PrivacyGrid = styled.div`
  display: flex;
  gap: 40px;
  margin: 15px auto 20px;
  max-width: fit-content;
`

const Button = styled(ButtonPrimaryLight)`
  font-size: 1rem;
  font-weight: 400;
  height: 24px;
  margin: 0 auto 10px;
  padding-left: 10px;
  padding-right: 10px;
`

const TokenValue = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`
const TotalAmount = styled.p`
  text-align: center;
`

interface Props extends HTMLAttributes<HTMLDivElement> {
  currentState: CreateDealState
  onCalculateDealModal: () => void
  onSetDealField: (value: unknown) => void
  onSetTotalPurchase: (value: string | undefined) => void
  totalPurchase: unknown
  isOpenPeriodDisabled: boolean
  amountInPool: { number: number; formatted: string }
}

export const DealCreateStepInput: React.FC<Props> = ({
  amountInPool,
  currentState,
  onCalculateDealModal,
  onKeyUp,
  onSetDealField,
  onSetTotalPurchase,
  totalPurchase,
  ...restProps
}) => {
  const step = currentState.currentStep
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus()
    }
  }, [step])

  const isOpenPeriodDisabled = useMemo(
    () => Number(currentState.totalPurchaseAmount) === amountInPool.number,
    [amountInPool, currentState.totalPurchaseAmount],
  )

  return (
    <Wrapper onKeyUp={onKeyUp} {...restProps}>
      {step === CreateDealSteps.dealToken ? (
        <TokenDropdown
          onChange={(token) => onSetDealField(token)}
          placeholder={createDealConfig[step].placeholder}
          tokenSelected={currentState[CreateDealSteps.dealToken]}
        />
      ) : step === CreateDealSteps.counterPartyAddress ? (
        <TextfieldWide
          maxLength={42}
          name={step}
          onChange={(e) => onSetDealField(e.target.value)}
          placeholder={createDealConfig[step].placeholder}
          ref={inputRef}
          type="text"
          value={currentState[step]}
        />
      ) : step === CreateDealSteps.dealTokenTotal ? (
        <>
          <TextfieldNarrow
            name={step}
            onChange={(e) => onSetDealField(e.target.value)}
            placeholder={createDealConfig[step].placeholder}
            ref={inputRef}
            type="number"
            value={currentState[step]}
          />

          <PrivacyGrid>
            <Button onClick={onCalculateDealModal}>Calculate</Button>
          </PrivacyGrid>
        </>
      ) : step === CreateDealSteps.totalPurchaseAmount ? (
        <>
          <TextfieldNarrow
            defaultValue={0}
            disabled={totalPurchase === 'all'}
            name={step}
            onChange={(e) => {
              const { value } = e.target
              onSetDealField(e.target.value)

              Number(value) === amountInPool.number
                ? onSetTotalPurchase('all')
                : Number(value) && Number(value) < amountInPool.number
                ? onSetTotalPurchase('partial')
                : onSetTotalPurchase(undefined)
            }}
            placeholder={createDealConfig[step].placeholder}
            ref={inputRef}
            type="number"
            value={currentState[step]}
          />
          <PrivacyGrid>
            <LabeledRadioButton
              checked={totalPurchase === 'all'}
              label={'All'}
              onClick={() => {
                onSetDealField(amountInPool.number)
                onSetTotalPurchase('all')
              }}
            />
            <LabeledRadioButton
              checked={totalPurchase === 'partial'}
              label="Partial"
              onClick={() => {
                onSetDealField(0)
                onSetTotalPurchase('partial')
              }}
            />
          </PrivacyGrid>
          <TotalAmount>
            Total amount deposited <TokenValue>{amountInPool.formatted}</TokenValue>
          </TotalAmount>
        </>
      ) : step === CreateDealSteps.counterPartyFundingPeriod ||
        step === CreateDealSteps.vestingCliff ||
        step === CreateDealSteps.proRataPeriod ||
        step === CreateDealSteps.vestingPeriod ? (
        <HMSInput
          autofocusOnRender
          defaultValue={currentState[step]}
          onChange={(value) => {
            console.log(value)
            onSetDealField(value)
          }}
        />
      ) : step === CreateDealSteps.openPeriod ? (
        <HMSInput
          autofocusOnRender
          defaultValue={currentState[step]}
          disabled={isOpenPeriodDisabled}
          onChange={(value) => onSetDealField(value)}
        />
      ) : null}
    </Wrapper>
  )
}

export default DealCreateStepInput
