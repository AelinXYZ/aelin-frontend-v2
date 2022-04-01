import type { NextPage } from 'next'
import Head from 'next/head'
import styled from 'styled-components'

import { Duration, add, format } from 'date-fns'

import { DeadlineInput } from '@/src/components/DeadlineInput'
import TokenDropdown from '@/src/components/TokenDropdown'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import { Token } from '@/src/constants/token'
import useAelinCreatePool, {
  CreatePoolState,
  CreatePoolSteps,
  createPoolConfig,
  createPoolConfigArr,
} from '@/src/hooks/aelin/useAelinCreatePool'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const PoolRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const SummaryRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-basis: 25%;
`

const StepsIndicator = ({
  currentStep,
}: {
  currentStep: CreatePoolSteps
  onStepClick: (step: CreatePoolSteps) => void
}) => {
  return (
    <PoolRow>
      {Object.values(CreatePoolSteps).map((step) => {
        const poolStepConfig = createPoolConfig[step]
        const isActive = currentStep === step

        return (
          <p key={step} style={{ color: isActive ? 'green' : 'inherit' }}>
            {poolStepConfig.title}
          </p>
        )
      })}
    </PoolRow>
  )
}

const StepInput = ({
  currentState,
  setPoolField,
}: {
  setPoolField: (field: CreatePoolSteps, value: unknown) => void
  currentState: CreatePoolState
}) => {
  const step = currentState.currentStep
  switch (step) {
    case CreatePoolSteps.poolName:
      return (
        <input
          name={step}
          onChange={(e) => setPoolField(CreatePoolSteps[step], e.target.value)}
          placeholder={createPoolConfig[step].placeholder}
          type="text"
          value={currentState[step]}
        />
      )
    case CreatePoolSteps.poolSymbol:
      return (
        <input
          name={step}
          onChange={(e) => setPoolField(CreatePoolSteps[step], e.target.value)}
          placeholder={createPoolConfig[step].placeholder}
          type="text"
          value={currentState[step]}
        />
      )
    case CreatePoolSteps.dealDeadline:
    case CreatePoolSteps.investmentDeadLine:
      return (
        <DeadlineInput
          defaultValue={currentState[step]}
          onChange={(value) => setPoolField(CreatePoolSteps[step], value)}
        />
      )
    case CreatePoolSteps.poolCap:
      return (
        <>
          <input
            defaultValue={currentState[step]}
            min={0}
            onChange={(e) => setPoolField(CreatePoolSteps[step], Number(e.target.value))}
            placeholder={createPoolConfig[step].placeholder}
            type="number"
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
              onChange={(e) => setPoolField(CreatePoolSteps[step], e.target.value)}
              type="radio"
              value="public"
            />
          </label>
          <label htmlFor="private_pool">
            Private
            <input
              checked={currentState[CreatePoolSteps.poolPrivacy] === 'private'}
              id="private_pool"
              onChange={(e) => setPoolField(CreatePoolSteps[step], e.target.value)}
              type="radio"
              value="private"
            />
          </label>
        </>
      )
    case CreatePoolSteps.sponsorFee:
      return (
        <>
          <input
            defaultValue={currentState[step]}
            min={0}
            onChange={(e) => setPoolField(CreatePoolSteps[step], Number(e.target.value))}
            placeholder={createPoolConfig[step].placeholder}
            type="number"
          />
        </>
      )
    case CreatePoolSteps.investmentToken:
      return (
        <TokenDropdown
          onChange={(token: Token) => setPoolField(CreatePoolSteps[step], token)}
          placeholder={createPoolConfig[step].placeholder}
          selectedAddress={currentState[CreatePoolSteps.investmentToken]?.address}
        />
      )
  }
}

const CreatePoolSummary = ({ currentState }: { currentState: CreatePoolState }) => {
  return (
    <>
      <SummaryRow>
        {createPoolConfigArr.map((step) => {
          let value = currentState[step.id] || '--'

          if (
            step.id === CreatePoolSteps.investmentDeadLine ||
            step.id === CreatePoolSteps.dealDeadline
          ) {
            value = Object.values(value as Duration).some((val) => !!val)
              ? format(add(Date.now(), value as Duration), 'LLL dd, yyyy HH:mma')
              : '--'
          }

          if (step.id === CreatePoolSteps.investmentToken) {
            value = currentState[step.id]?.symbol as string
          }

          return (
            <div key={step.id}>
              <h4>{step.title}:</h4>
              <p>{value}</p>
            </div>
          )
        })}
      </SummaryRow>
    </>
  )
}

const CreatePool: NextPage = () => {
  const { appChainId } = useWeb3Connection()
  const {
    createPoolState,
    errors,
    handleSubmit,
    isFinalStep,
    isFirstStep,
    moveStep,
    setPoolField,
  } = useAelinCreatePool(appChainId)

  const currentStepConfig = createPoolConfig[createPoolState.currentStep]

  const currentStepError = errors ? errors[createPoolState.currentStep] : null

  return (
    <>
      <Head>Create Pool</Head>
      <RightTimelineLayout timeline={<>Timeline stuff</>}>
        <StepsIndicator currentStep={createPoolState.currentStep} onStepClick={moveStep} />
        <br />
        <br />
        <br />
        <p>{currentStepConfig.title}</p>
        <p>{currentStepConfig.text}</p>

        {Object.values(CreatePoolSteps).map((step) => {
          const isStepVisible = createPoolState.currentStep === step

          return (
            isStepVisible && (
              <div key={step}>
                <StepInput currentState={createPoolState} setPoolField={setPoolField} />
                {currentStepError && <p>{currentStepError}</p>}

                {!isFinalStep ? (
                  <button
                    disabled={!!currentStepError}
                    key={`${step}_button`}
                    onClick={() => moveStep('next')}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    disabled={errors ? Object.values(errors).some((err) => !!err) : false}
                    key={`${step}_button`}
                    onClick={handleSubmit}
                  >
                    Create Pool
                  </button>
                )}
              </div>
            )
          )
        })}

        <PoolRow>
          {!isFirstStep && <button onClick={() => moveStep('prev')}>Prev</button>}

          {isFirstStep && !currentStepError && (
            <button onClick={() => moveStep('next')}>Next</button>
          )}
        </PoolRow>

        <CreatePoolSummary currentState={createPoolState} />
      </RightTimelineLayout>
    </>
  )
}

export default CreatePool
