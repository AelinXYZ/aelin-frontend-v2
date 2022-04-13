import { HTMLAttributes, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { HMSInput } from '@/src/components/pools/common/HMSInput'
import TokenDropdown from '@/src/components/pools/common/TokenDropdown'
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

interface Props extends HTMLAttributes<HTMLDivElement> {
  setDealField: (value: unknown) => void
  currentState: CreateDealState
}

export const DealCreateStepInput: React.FC<Props> = ({
  currentState,
  onKeyUp,
  setDealField,
  ...restProps
}) => {
  const step = currentState.currentStep
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus()
    }
  }, [step])

  return (
    <Wrapper onKeyUp={onKeyUp} {...restProps}>
      {step === CreateDealSteps.dealToken ? (
        <TokenDropdown
          onChange={(token) => setDealField(token)}
          placeholder={createDealConfig[step].placeholder}
          tokenSelected={currentState[CreateDealSteps.dealToken]}
        />
      ) : step === CreateDealSteps.counterPartyAddress ? (
        <TextfieldWide
          maxLength={42}
          name={step}
          onChange={(e) => setDealField(e.target.value)}
          placeholder={createDealConfig[step].placeholder}
          ref={inputRef}
          type="text"
          value={currentState[step]}
        />
      ) : step === CreateDealSteps.dealTokenTotal ||
        step === CreateDealSteps.totalPurchaseAmount ? (
        <TextfieldNarrow
          name={step}
          onChange={(e) => setDealField(e.target.value)}
          placeholder={createDealConfig[step].placeholder}
          ref={inputRef}
          type="number"
          value={currentState[step]}
        />
      ) : step === CreateDealSteps.counterPartyFundingPeriod ||
        step === CreateDealSteps.vestingCliff ||
        step === CreateDealSteps.proRataPeriod ||
        step === CreateDealSteps.openPeriod ||
        step === CreateDealSteps.vestingPeriod ? (
        <HMSInput
          autofocusOnRender
          defaultValue={currentState[step]}
          onChange={(value) => setDealField(value)}
        />
      ) : null}
    </Wrapper>
  )
}

export default DealCreateStepInput
