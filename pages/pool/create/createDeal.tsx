import type { NextPage } from 'next'
import Head from 'next/head'
import styled from 'styled-components'

import { StepIndicator } from '@/src/components/StepIndicator'
import { Summary } from '@/src/components/Summary'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import DealCreateStepInput from '@/src/components/pools/DealCreateStepInput'
import useAelinCreateDeal, {
  CreateDealSteps,
  createDealConfig,
  getCreateDealStepIndicatorData,
  getCreateDealSummaryData,
} from '@/src/hooks/aelin/useAelinCreateDeal'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const PoolRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const CreateDeal: NextPage = () => {
  const { appChainId } = useWeb3Connection()
  const {
    createDealState,
    errors,
    handleSubmit,
    isFinalStep,
    isFirstStep,
    isSubmitting,
    moveStep,
    setDealField,
  } = useAelinCreateDeal(appChainId, '0xc25d911ea6a74a3c550eec15c344206bea29ffe2')

  const currentStepConfig = createDealConfig[createDealState.currentStep]

  const currentStepError = errors ? errors[createDealState.currentStep] : null

  const disableSubmit = (errors && Object.values(errors).some((err) => !!err)) || isSubmitting

  return (
    <>
      <Head>Create Pool</Head>
      <RightTimelineLayout timeline={<>Timeline stuff</>}>
        <StepIndicator data={getCreateDealStepIndicatorData(createDealState.currentStep)} />
        <br />
        <br />
        <br />
        <p>{currentStepConfig.title}</p>
        <p>{currentStepConfig.text}</p>

        {Object.values(CreateDealSteps).map((step) => {
          const isStepVisible = createDealState.currentStep === step
          if (!isStepVisible) return null

          return (
            <div key={step}>
              <DealCreateStepInput currentState={createDealState} setDealField={setDealField} />

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
                  Create Deal
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

        <Summary data={getCreateDealSummaryData(createDealState)} />
      </RightTimelineLayout>
    </>
  )
}

export default CreateDeal
