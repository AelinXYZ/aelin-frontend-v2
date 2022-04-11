import styled from 'styled-components'

import { LabeledRadioButton } from '@/src/components/form/LabeledRadioButton'
import { HMSInput } from '@/src/components/pools/HMSInput'
import TokenDropdown from '@/src/components/pools/TokenDropdown'
import { Textfield as BaseTextField } from '@/src/components/pureStyledComponents/form/Textfield'
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
  display: grid;
  gap: 40px;
  grid-template-columns: 1fr 1fr;
  margin: 0 auto;
  max-width: fit-content;
`

const PoolCreateStepInput: React.FC<{
  setPoolField: (value: unknown) => void
  currentState: CreatePoolState
}> = ({ currentState, setPoolField, ...restProps }) => {
  const step = currentState.currentStep

  return (
    <Wrapper {...restProps}>
      {step === CreatePoolSteps.poolName ? (
        <Textfield
          maxLength={16}
          name={step}
          onChange={(e) => setPoolField(e.target.value)}
          placeholder={createPoolConfig[step].placeholder}
          type="text"
          value={currentState[step]}
        />
      ) : step === CreatePoolSteps.poolSymbol ? (
        <Textfield
          maxLength={8}
          name={step}
          onChange={(e) => setPoolField(e.target.value)}
          placeholder={createPoolConfig[step].placeholder}
          type="text"
          value={currentState[step]}
        />
      ) : step === CreatePoolSteps.dealDeadline || step === CreatePoolSteps.investmentDeadLine ? (
        <HMSInput defaultValue={currentState[step]} onChange={(value) => setPoolField(value)} />
      ) : step === CreatePoolSteps.poolCap ? (
        <Textfield
          maxLength={8}
          name={step}
          onChange={(e) => setPoolField(e.target.value)}
          placeholder={createPoolConfig[step].placeholder}
          type="number"
          value={currentState[step]}
        />
      ) : step === CreatePoolSteps.poolPrivacy ? (
        <PrivacyGrid>
          <LabeledRadioButton
            checked={currentState[CreatePoolSteps.poolPrivacy] === 'public'}
            label={'Public'}
            onClick={() => setPoolField('public')}
          />
          <LabeledRadioButton
            checked={currentState[CreatePoolSteps.poolPrivacy] === 'private'}
            label="Private"
            onClick={() => setPoolField('private')}
          />
        </PrivacyGrid>
      ) : step === CreatePoolSteps.sponsorFee ? (
        <SponsorFeeTextfield
          maxLength={8}
          name={step}
          onChange={(e) => setPoolField(e.target.value)}
          placeholder={createPoolConfig[step].placeholder}
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
