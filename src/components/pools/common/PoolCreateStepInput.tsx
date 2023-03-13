import { HTMLAttributes, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { LabeledCheckbox } from '@/src/components/form/LabeledCheckbox'
import { LabeledRadioButton } from '@/src/components/form/LabeledRadioButton'
import { HMSInput } from '@/src/components/pools/common/HMSInput'
import TokenDropdown from '@/src/components/pools/common/TokenDropdown'
import { Textfield as BaseTextField } from '@/src/components/pureStyledComponents/form/Textfield'
import { Privacy } from '@/src/constants/pool'
import {
  CreatePoolState,
  CreatePoolSteps,
  createPoolConfig,
} from '@/src/hooks/aelin/useAelinCreatePool'

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 100%;
`

const Textfield = styled(BaseTextField)`
  max-width: 100%;
  width: 320px;
`

const SponsorFeeTextfield = styled(Textfield)`
  width: 160px;
`

const PrivacyGrid = styled.div`
  display: flex;
  gap: 40px;
  margin: 0 auto;
  max-width: fit-content;
`

const Checkbox = styled(LabeledCheckbox)`
  margin: 20px auto 0;
  width: fit-content;
`

interface Props extends HTMLAttributes<HTMLDivElement> {
  setPoolField: (value: unknown) => void
  currentState: CreatePoolState
}

const PoolCreateStepInput: React.FC<Props> = ({
  currentState,
  onKeyUp,
  setPoolField,
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
      {step === CreatePoolSteps.poolName ? (
        <Textfield
          data-cy="pool-name-input"
          maxLength={31}
          name={step}
          onChange={(e) => setPoolField(e.target.value)}
          placeholder={createPoolConfig[step].placeholder}
          ref={inputRef}
          type="text"
          value={currentState[step]}
        />
      ) : step === CreatePoolSteps.poolSymbol ? (
        <Textfield
          data-cy="pool-symbol-input"
          maxLength={8}
          name={step}
          onChange={(e) => setPoolField(e.target.value)}
          placeholder={createPoolConfig[step].placeholder}
          ref={inputRef}
          type="text"
          value={currentState[step]}
        />
      ) : step === CreatePoolSteps.dealDeadline || step === CreatePoolSteps.investmentDeadLine ? (
        <HMSInput
          autofocusOnRender
          defaultValue={currentState[step]}
          onChange={(value) => setPoolField(value)}
        />
      ) : step === CreatePoolSteps.poolCap ? (
        <>
          <Textfield
            data-cy="no-cap-input"
            disabled={currentState[step] === 0}
            maxLength={8}
            name={step}
            onChange={(e) =>
              setPoolField(e.target.value === '' ? undefined : Number(e.target.value))
            }
            placeholder={createPoolConfig[step].placeholder}
            ref={inputRef}
            type="number"
            value={currentState[step] === undefined ? '' : currentState[step]}
          />
          <Checkbox
            checked={currentState[step] === 0}
            data-cy="no-cap-labeled-checkbox"
            label={'No cap'}
            onClick={() => {
              setPoolField(currentState[step] === 0 ? undefined : 0)
            }}
          />
        </>
      ) : step === CreatePoolSteps.poolPrivacy ? (
        <PrivacyGrid>
          <LabeledRadioButton
            checked={currentState[CreatePoolSteps.poolPrivacy] === Privacy.PUBLIC}
            label={'Public'}
            onClick={() => setPoolField(Privacy.PUBLIC)}
          />
          <LabeledRadioButton
            checked={currentState[CreatePoolSteps.poolPrivacy] === Privacy.PRIVATE}
            label="Private"
            onClick={() => setPoolField(Privacy.PRIVATE)}
          />
          <LabeledRadioButton
            checked={currentState[CreatePoolSteps.poolPrivacy] === Privacy.NFT}
            label="NFT"
            onClick={() => setPoolField(Privacy.NFT)}
          />
        </PrivacyGrid>
      ) : step === CreatePoolSteps.sponsorFee ? (
        <SponsorFeeTextfield
          data-cy="sponsor-fee-input"
          maxLength={8}
          name={step}
          onChange={(e) => setPoolField(e.target.value)}
          placeholder={createPoolConfig[step].placeholder}
          ref={inputRef}
          type="number"
          value={currentState[step]}
        />
      ) : step === CreatePoolSteps.investmentToken ? (
        <TokenDropdown
          onChange={(token) => setPoolField(token)}
          placeholder={createPoolConfig[step].placeholder}
          tokenSelected={currentState[CreatePoolSteps.investmentToken]}
        />
      ) : null}
    </Wrapper>
  )
}

export default PoolCreateStepInput
