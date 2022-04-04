import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback } from 'react'
import styled from 'styled-components'

import { StepIndicator } from '@/src/components/StepIndicator'
import { Summary } from '@/src/components/Summary'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import useAelinCreatePool, {
  CreatePoolSteps,
  createPoolConfig,
  getCreatePoolStepIndicatorData,
  getCreatePoolSummaryData,
} from '@/src/hooks/aelin/useAelinCreatePool'
import PoolCreateStepInput from '@/src/page_helpers/PoolCreateStepInput'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const PoolRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const CreatePool: NextPage = () => {
  const { appChainId } = useWeb3Connection()
  const {
    createPoolState,
    errors,
    handleSubmit,
    isFinalStep,
    isFirstStep,
    isSubmitting,
    moveStep,
    setPoolField,
  } = useAelinCreatePool(appChainId)

  const currentStepConfig = createPoolConfig[createPoolState.currentStep]

  const currentStepError = errors ? errors[createPoolState.currentStep] : null

  const disableSubmit = (errors && Object.values(errors).some((err) => !!err)) || isSubmitting

  return (
    <>
      <Head>Create Pool</Head>
      <RightTimelineLayout timeline={<>Timeline stuff</>}>
        <StepIndicator data={getCreatePoolStepIndicatorData(createPoolState.currentStep)} />
        <br />
        <br />
        <br />
        <p>{currentStepConfig.title}</p>
        <p>{currentStepConfig.text}</p>

        {Object.values(CreatePoolSteps).map((step) => {
          const isStepVisible = createPoolState.currentStep === step
          if (!isStepVisible) return null

          return (
            <div key={step}>
              <PoolCreateStepInput currentState={createPoolState} setPoolField={setPoolField} />

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
                <button disabled={disableSubmit} key={`${step}_button`} onClick={handleSubmit}>
                  Create Pool
                </button>
              )}
            </div>
          )
        })}

        <PoolRow>
          {!isFirstStep && <button onClick={() => moveStep('prev')}>Prev</button>}

          {isFirstStep && !currentStepError && (
            <button onClick={() => moveStep('next')}>Next</button>
          )}
        </PoolRow>

        <Summary data={getCreatePoolSummaryData(createPoolState)} />
      </RightTimelineLayout>
    </>
  )
}

export default CreatePool
