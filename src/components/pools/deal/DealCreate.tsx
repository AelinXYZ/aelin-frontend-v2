import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { formatUnits } from '@ethersproject/units'
import Wei from '@synthetixio/wei'

import { CardTitle, CardWithTitle } from '@/src/components/common/CardWithTitle'
import ConfirmTransactionModal from '@/src/components/pools/common/ConfirmTransactionModal'
import {
  ButtonWrapper,
  Description,
  PrevNextWrapper,
  StepContents,
  Title,
  WrapperGrid,
} from '@/src/components/pools/common/Create'
import { Summary } from '@/src/components/pools/common/Summary'
import DealCalculationModal from '@/src/components/pools/deal/DealCalculationModal'
import DealCreateStepInput from '@/src/components/pools/deal/DealCreateStepInput'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import {
  ButtonNext,
  ButtonPrev,
} from '@/src/components/pureStyledComponents/buttons/ButtonPrevNext'
import { Error } from '@/src/components/pureStyledComponents/text/Error'
import { StepIndicator as BaseStepIndicator } from '@/src/components/timeline/StepIndicator'
import { Token } from '@/src/constants/token'
import useAelinCreateDeal, {
  CreateDealSteps,
  createDealConfig,
  getCreateDealStepIndicatorData,
  getCreateDealSummaryData,
} from '@/src/hooks/aelin/useAelinCreateDeal'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const StepIndicator = styled(BaseStepIndicator)`
  .stepText {
    padding-left: 0;
    padding-right: 0;
  }
`

const DealCreate = ({ pool }: { pool: ParsedAelinPool }) => {
  const { appChainId } = useWeb3Connection()
  const [showDealCalculationModal, setShowDealCalculationModal] = useState(false)
  const [totalPurchase, setTotalPurchase] = useState<string | undefined>()
  const {
    createDealState,
    errors,
    gasLimitEstimate,
    handleCreateDeal,
    handleSubmit,
    investmentTokenInfo,
    isFinalStep,
    isFirstStep,
    isSubmitting,
    moveStep,
    setDealField,
    setGasPrice,
  } = useAelinCreateDeal(appChainId, pool)

  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false)

  const currentStepConfig = createDealConfig[createDealState.currentStep]
  const { order, text, title } = currentStepConfig
  const currentStepError = errors ? errors[createDealState.currentStep] : null
  const disableSubmit = (errors && Object.values(errors).some((err) => !!err)) || isSubmitting

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Enter' && !currentStepError) {
      moveStep('next')
    }
  }

  useEffect(() => {
    if (showSubmitModal) handleCreateDeal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSubmitModal])

  useEffect(() => {
    if (
      totalPurchase === 'all' &&
      createDealState.currentStep === CreateDealSteps.totalPurchaseAmount
    ) {
      try {
        setDealField(Number(formatUnits(pool.amountInPool.raw, pool.investmentTokenDecimals)))
      } catch (e) {
        setDealField(0)
      }
    }
  }, [
    createDealState.currentStep,
    pool.amountInPool.raw,
    pool.investmentTokenDecimals,
    setDealField,
    totalPurchase,
  ])

  return (
    <>
      <Head>
        <title>Deal creation</title>
      </Head>
      <CardWithTitle titles={<CardTitle>Deal creation</CardTitle>}>
        <StepIndicator
          currentStepOrder={order}
          data={getCreateDealStepIndicatorData(createDealState.currentStep)}
        />
        {Object.values(CreateDealSteps).map((step) => {
          const isStepVisible = createDealState.currentStep === step

          return !isStepVisible ? null : (
            <WrapperGrid>
              <PrevNextWrapper>
                {!isFirstStep && <ButtonPrev onClick={() => moveStep('prev')} />}
              </PrevNextWrapper>
              <StepContents>
                <Title>{title}</Title>
                <Description>{text}</Description>
                <DealCreateStepInput
                  currentState={createDealState}
                  onCalculateDealModal={() => setShowDealCalculationModal(true)}
                  onKeyUp={handleKeyUp}
                  onSetDealField={setDealField}
                  onSetTotalPurchase={setTotalPurchase}
                  role="none"
                  totalPurchase={totalPurchase}
                />
                {currentStepError && typeof currentStepError === 'string' && (
                  <Error>{currentStepError}</Error>
                )}
                <ButtonWrapper>
                  {!isFinalStep ? (
                    <GradientButton disabled={!!currentStepError} onClick={() => moveStep('next')}>
                      Next
                    </GradientButton>
                  ) : (
                    <GradientButton
                      disabled={disableSubmit}
                      key={`${step}_button`}
                      onClick={() => setShowSubmitModal(true)}
                    >
                      Create Deal
                    </GradientButton>
                  )}
                </ButtonWrapper>
                <Summary data={getCreateDealSummaryData(createDealState)} />
              </StepContents>
              <PrevNextWrapper>
                {!isFinalStep && (
                  <ButtonNext disabled={!!currentStepError} onClick={() => moveStep('next')} />
                )}
              </PrevNextWrapper>
            </WrapperGrid>
          )
        })}
      </CardWithTitle>
      {showDealCalculationModal && (
        <DealCalculationModal
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
      {showSubmitModal && (
        <ConfirmTransactionModal
          disableButton={isSubmitting}
          gasLimitEstimate={gasLimitEstimate}
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleSubmit}
          setGasPrice={(gasPrice: Wei) => setGasPrice(gasPrice)}
          title={'Create deal'}
        />
      )}
    </>
  )
}

export default DealCreate
