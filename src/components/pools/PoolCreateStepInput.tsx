import styled from 'styled-components'

import { BigNumberInput } from 'big-number-input'

import { HMSInput } from '@/src/components/HMSInput'
import TokenDropdown from '@/src/components/pools/TokenDropdown'
import { Textfield as BaseTextField } from '@/src/components/pureStyledComponents/form/Textfield'
import {
  CreatePoolState,
  CreatePoolSteps,
  createPoolConfig,
} from '@/src/hooks/aelin/useAelinCreatePool'

const Wrapper = styled.div`
  margin: 0 auto 40px;
  max-width: 100%;
  width: 320px;
`

const Textfield = styled(BaseTextField)`
  width: 100%;
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
        <>
          <BigNumberInput
            decimals={currentState[CreatePoolSteps.investmentToken]?.decimals as number}
            min="0"
            onChange={(value) => setPoolField(value)}
            placeholder={createPoolConfig[step].placeholder}
            value={currentState[step] ? (currentState[step] as string) : ''}
          />
        </>
      ) : step === CreatePoolSteps.poolPrivacy ? (
        <>
          <label htmlFor="public_pool">
            Public
            <Textfield
              checked={currentState[CreatePoolSteps.poolPrivacy] === 'public'}
              id="public_pool"
              onChange={(e) => setPoolField(e.target.value)}
              type="radio"
              value="public"
            />
          </label>
          <label htmlFor="private_pool">
            Private
            <Textfield
              checked={currentState[CreatePoolSteps.poolPrivacy] === 'private'}
              id="private_pool"
              onChange={(e) => setPoolField(e.target.value)}
              type="radio"
              value="private"
            />
          </label>
        </>
      ) : step === CreatePoolSteps.sponsorFee ? (
        <>
          <BigNumberInput
            decimals={18}
            min="0"
            onChange={(value) => setPoolField(value)}
            placeholder={createPoolConfig[step].placeholder}
            value={currentState[step] ? (currentState[step] as string) : ''}
          />
        </>
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
