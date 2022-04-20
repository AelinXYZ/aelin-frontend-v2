import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

import Wei from '@synthetixio/wei'

import { CardTitle, CardWithTitle } from '@/src/components/common/CardWithTitle'
import { PageTitle } from '@/src/components/common/PageTitle'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import ConfirmTransactionModal from '@/src/components/pools/ConfirmTransactionModal'
import {
  ButtonWrapper,
  Description,
  PrevNextWrapper,
  StepContents,
  Title,
  WrapperGrid,
} from '@/src/components/pools/common/Create'
import { Summary } from '@/src/components/pools/common/Summary'
import { Timeline } from '@/src/components/pools/common/Timeline'
import PoolCreateStepInput from '@/src/components/pools/main/PoolCreateStepInput'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import {
  ButtonNext,
  ButtonPrev,
} from '@/src/components/pureStyledComponents/buttons/ButtonPrevNext'
import { Error } from '@/src/components/pureStyledComponents/text/Error'
import { StepIndicator } from '@/src/components/timeline/StepIndicator'
import useAelinCreatePool, {
  CreatePoolSteps,
  createPoolConfig,
  getCreatePoolStepIndicatorData,
  getCreatePoolSummaryData,
} from '@/src/hooks/aelin/useAelinCreatePool'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Create: NextPage = () => {
  const { appChainId } = useWeb3Connection()
  const {
    createPoolState,
    errors,
    gasLimitEstimate,
    handleCreatePool,
    handleSubmit,
    isFinalStep,
    isFirstStep,
    isSubmitting,
    moveStep,
    setGasPrice,
    setPoolField,
  } = useAelinCreatePool(appChainId)

  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false)

  const currentStepConfig = createPoolConfig[createPoolState.currentStep]
  const { order, text, title } = currentStepConfig
  const currentStepError = errors ? errors[createPoolState.currentStep] : null
  const disableSubmit = (errors && Object.values(errors).some((err) => !!err)) || isSubmitting

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Enter' && !currentStepError) {
      moveStep('next')
    }
  }

  useEffect(() => {
    if (showSubmitModal) handleCreatePool()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSubmitModal])

  return (
    <>
      <Head>
        <title>{`${createPoolState.poolName || 'Create pool'}`}</title>
      </Head>
      <PageTitle title={`${createPoolState.poolName || 'Pool creation'}`} />
      <RightTimelineLayout timeline={<Timeline activeItem={1} />}>
        <CardWithTitle titles={<CardTitle>Pool creation</CardTitle>}>
          <StepIndicator
            currentStepOrder={order}
            data={getCreatePoolStepIndicatorData(createPoolState.currentStep)}
          />
          {Object.values(CreatePoolSteps).map((step) => {
            const isStepVisible = createPoolState.currentStep === step

            return !isStepVisible ? null : (
              <WrapperGrid>
                <PrevNextWrapper>
                  {!isFirstStep && <ButtonPrev onClick={() => moveStep('prev')} />}
                </PrevNextWrapper>
                <StepContents>
                  <Title>{title}</Title>
                  <Description>{text}</Description>
                  <PoolCreateStepInput
                    currentState={createPoolState}
                    key={step}
                    onKeyUp={handleKeyUp}
                    role="none"
                    setPoolField={setPoolField}
                  />
                  {currentStepError && typeof currentStepError === 'string' && (
                    <Error>{currentStepError}</Error>
                  )}
                  <ButtonWrapper>
                    {isFinalStep ? (
                      <GradientButton
                        disabled={disableSubmit}
                        key={`${step}_button`}
                        onClick={() => setShowSubmitModal(true)}
                      >
                        Create Pool
                      </GradientButton>
                    ) : (
                      <GradientButton
                        disabled={!!currentStepError}
                        key={`${step}_button`}
                        onClick={() => moveStep('next')}
                      >
                        Next
                      </GradientButton>
                    )}
                  </ButtonWrapper>
                  <Summary data={getCreatePoolSummaryData(createPoolState)} />
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
      </RightTimelineLayout>
      {showSubmitModal && (
        <ConfirmTransactionModal
          disableButton={isSubmitting}
          gasLimitEstimate={gasLimitEstimate}
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleSubmit}
          setGasPrice={(gasPrice: Wei) => setGasPrice(gasPrice)}
          title={'Create pool'}
        />
      )}
    </>
  )
}

export default Create
