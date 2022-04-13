import Head from 'next/head'
import { useState } from 'react'
import styled from 'styled-components'

import { Summary } from '@/src/components/pools/common/Summary'
import DealConfirmationModal from '@/src/components/pools/deal/DealConfirmationModal'
import DealCreateStepInput from '@/src/components/pools/deal/DealCreateStepInput'
import { StepIndicator } from '@/src/components/timeline/StepIndicator'
import { Token } from '@/src/constants/token'
import useAelinCreateDeal, {
  CreateDealSteps,
  createDealConfig,
  getCreateDealStepIndicatorData,
  getCreateDealSummaryData,
} from '@/src/hooks/aelin/useAelinCreateDeal'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const PoolRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const DealCreate = ({ pool }: { pool: ParsedAelinPool }) => {
  const { appChainId } = useWeb3Connection()
  const [showDealCalculationModal, setShowDealCalculationModal] = useState(false)
  const {
    createDealState,
    errors,
    handleSubmit,
    investmentTokenInfo,
    isFinalStep,
    isFirstStep,
    isSubmitting,
    moveStep,
    setDealField,
  } = useAelinCreateDeal(appChainId, pool)

  const currentStepConfig = createDealConfig[createDealState.currentStep]

  const currentStepError = errors ? errors[createDealState.currentStep] : null

  const disableSubmit = (errors && Object.values(errors).some((err) => !!err)) || isSubmitting

  return (
    <>
      <Head>Create Pool</Head>
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

            {createDealState.currentStep === CreateDealSteps.totalPurchaseAmount && (
              <>
                <button onClick={() => setShowDealCalculationModal(true)}>Calculate</button>
                {showDealCalculationModal && (
                  <DealConfirmationModal
                    dealToken={createDealState.dealToken as Token}
                    dealTokenAmount={createDealState.dealTokenTotal as string}
                    investmentToken={investmentTokenInfo as Token}
                    investmentTokenAmount={pool.amountInPool.formatted as string}
                    onClose={() => setShowDealCalculationModal(false)}
                    onConfirm={(value) => {
                      setDealField(value)
                      setShowDealCalculationModal(false)
                    }}
                  />
                )}
              </>
            )}

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

        {isFirstStep && !currentStepError && <button onClick={() => moveStep('next')}>Next</button>}
      </PoolRow>

      <Summary data={getCreateDealSummaryData(createDealState)} />
    </>
  )
}

export default DealCreate
