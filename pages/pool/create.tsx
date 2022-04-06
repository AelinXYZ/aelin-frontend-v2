import type { NextPage } from 'next'
import Head from 'next/head'
import styled from 'styled-components'

import { Summary } from '@/src/components/Summary'
import { CardWithTitle } from '@/src/components/common/CardWithTitle'
import { PageTitle } from '@/src/components/common/PageTitle'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import PoolCreateStepInput from '@/src/components/pools/PoolCreateStepInput'
import { StepIndicator } from '@/src/components/timeline/StepIndicator'
import useAelinCreatePool, {
  CreatePoolSteps,
  createPoolConfig,
  getCreatePoolStepIndicatorData,
  getCreatePoolSummaryData,
} from '@/src/hooks/aelin/useAelinCreatePool'
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
      <PageTitle title={'Create pool'} />
      <RightTimelineLayout timeline={<>Timeline stuff</>}>
        <CardWithTitle title={'Pool creation'}>
          <StepIndicator
            currentStepOrder={currentStepConfig.order}
            data={getCreatePoolStepIndicatorData(createPoolState.currentStep)}
          />
          <p>{currentStepConfig.title}</p>
          <p>{currentStepConfig.text}</p>

          {Object.values(CreatePoolSteps).map((step) => {
            const isStepVisible = createPoolState.currentStep === step

            return !isStepVisible ? null : (
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
        </CardWithTitle>
      </RightTimelineLayout>
    </>
  )
}

export default CreatePool
