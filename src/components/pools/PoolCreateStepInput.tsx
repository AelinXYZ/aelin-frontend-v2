import { BigNumberInput } from 'big-number-input'

import { HMSInput } from '@/src/components/HMSInput'
import { TokenInput } from '@/src/components/TokenInput'
import {
  CreatePoolState,
  CreatePoolSteps,
  createPoolConfig,
} from '@/src/hooks/aelin/useAelinCreatePool'
import TokenDropdown from '@/src/page_helpers/TokenDropdown'

const PoolCreateStepInput = ({
  currentState,
  setPoolField,
}: {
  setPoolField: (value: unknown) => void
  currentState: CreatePoolState
}) => {
  const step = currentState.currentStep

  switch (step) {
    case CreatePoolSteps.poolName:
      return (
        <input
          maxLength={16}
          name={step}
          onChange={(e) => setPoolField(e.target.value)}
          placeholder={createPoolConfig[step].placeholder}
          type="text"
          value={currentState[step]}
        />
      )
    case CreatePoolSteps.poolSymbol:
      return (
        <input
          maxLength={8}
          name={step}
          onChange={(e) => setPoolField(e.target.value)}
          placeholder={createPoolConfig[step].placeholder}
          type="text"
          value={currentState[step]}
        />
      )
    case CreatePoolSteps.dealDeadline:
    case CreatePoolSteps.investmentDeadLine:
      return (
        <HMSInput defaultValue={currentState[step]} onChange={(value) => setPoolField(value)} />
      )
    case CreatePoolSteps.poolCap:
      return (
        <>
          <BigNumberInput
            decimals={currentState[CreatePoolSteps.investmentToken]?.decimals as number}
            min="0"
            onChange={(value) => setPoolField(value)}
            placeholder={createPoolConfig[step].placeholder}
            value={currentState[step] ? (currentState[step] as string) : ''}
          />
        </>
      )
    case CreatePoolSteps.poolPrivacy:
      return (
        <>
          <label htmlFor="public_pool">
            Public
            <input
              checked={currentState[CreatePoolSteps.poolPrivacy] === 'public'}
              id="public_pool"
              onChange={(e) => setPoolField(e.target.value)}
              type="radio"
              value="public"
            />
          </label>
          <label htmlFor="private_pool">
            Private
            <input
              checked={currentState[CreatePoolSteps.poolPrivacy] === 'private'}
              id="private_pool"
              onChange={(e) => setPoolField(e.target.value)}
              type="radio"
              value="private"
            />
          </label>
        </>
      )
    case CreatePoolSteps.sponsorFee:
      return (
        <>
          <BigNumberInput
            decimals={18}
            min="0"
            onChange={(value) => setPoolField(value)}
            placeholder={createPoolConfig[step].placeholder}
            value={currentState[step] ? (currentState[step] as string) : ''}
          />
        </>
      )
    case CreatePoolSteps.investmentToken:
      return (
        <TokenDropdown
          onChange={(token) => setPoolField(token)}
          placeholder={createPoolConfig[step].placeholder}
          tokenSelected={currentState[CreatePoolSteps.investmentToken]}
        />
      )
  }
}

export default PoolCreateStepInput
