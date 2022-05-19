import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import styled from 'styled-components'

import { CardTitle, CardWithTitle } from '@/src/components/common/CardWithTitle'
import { PageTitle } from '@/src/components/common/PageTitle'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import {
  ButtonWrapper,
  Description,
  MobileButtonWrapper,
  PrevNextWrapper,
  StepContents,
  Title,
  WrapperGrid,
} from '@/src/components/pools/common/Create'
import { Summary } from '@/src/components/pools/common/Summary'
import PoolCreateStepInput from '@/src/components/pools/main/PoolCreateStepInput'
import WhiteListModal, { WhitelistProps } from '@/src/components/pools/whitelist/WhiteListModal'
import {
  ButtonPrimaryLight,
  GradientButton,
} from '@/src/components/pureStyledComponents/buttons/Button'
import {
  ButtonNext,
  ButtonPrev,
} from '@/src/components/pureStyledComponents/buttons/ButtonPrevNext'
import { Error } from '@/src/components/pureStyledComponents/text/Error'
import { StepIndicator } from '@/src/components/steps/StepIndicator'
import { Privacy } from '@/src/constants/pool'
import useAelinCreatePool, {
  CreatePoolSteps,
  createPoolConfig,
  getCreatePoolStepIndicatorData,
  getCreatePoolSummaryData,
} from '@/src/hooks/aelin/useAelinCreatePool'
import { useTimelineStatus } from '@/src/hooks/aelin/useAelinPoolStatus'
import { useWarningOnLeavePage } from '@/src/hooks/useWarningOnLeavePage'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const BackButton = styled(ButtonPrimaryLight)`
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    display: none;
  }
`

const Create: NextPage = () => {
  const { appChainId } = useWeb3Connection()
  const {
    createPoolState,
    errors,
    handleCreatePool,
    isFinalStep,
    isFirstStep,
    isSubmitting,
    moveStep,
    setPoolField,
    showWarningOnLeave,
  } = useAelinCreatePool(appChainId)
  const [showWhiteListModal, setShowWhiteListModal] = useState<boolean>(false)
  const currentStepConfig = createPoolConfig[createPoolState.currentStep]
  const { order, text, title } = currentStepConfig
  const currentStepError = errors ? errors[createPoolState.currentStep] : null
  const disableSubmit = (errors && Object.values(errors).some((err) => !!err)) || isSubmitting

  useWarningOnLeavePage(() => showWarningOnLeave)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Enter' && !currentStepError) {
      moveStep('next')
    }
  }

  const timeline = useTimelineStatus()

  return (
    <>
      <Head>
        <title>{`${createPoolState.poolName || 'Create pool'}`}</title>
      </Head>
      <PageTitle title={`${createPoolState.poolName || 'Pool creation'}`} />
      <RightTimelineLayout timelineSteps={timeline}>
        <CardWithTitle titles={<CardTitle>Pool creation</CardTitle>}>
          <StepIndicator
            currentStepOrder={order}
            data={getCreatePoolStepIndicatorData(createPoolState.currentStep)}
          />
          {Object.values(CreatePoolSteps).map((step, index) => {
            const isStepVisible = createPoolState.currentStep === step

            return !isStepVisible ? null : (
              <WrapperGrid key={index}>
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
                    {isFinalStep && createPoolState.poolPrivacy === Privacy.PRIVATE && (
                      <ButtonPrimaryLight onClick={() => setShowWhiteListModal(true)}>
                        Edit whitelisted addresses
                      </ButtonPrimaryLight>
                    )}
                    <MobileButtonWrapper>
                      <BackButton disabled={isFirstStep} onClick={() => moveStep('prev')}>
                        Back
                      </BackButton>
                      {isFinalStep ? (
                        <GradientButton
                          disabled={disableSubmit}
                          key={`${step}_button`}
                          onClick={() => {
                            handleCreatePool()
                          }}
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
                    </MobileButtonWrapper>
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
      {showWhiteListModal && (
        <WhiteListModal
          currentList={createPoolState.whitelist}
          onClose={() => setShowWhiteListModal(false)}
          onConfirm={(whitelist: WhitelistProps[]) => setPoolField(whitelist, 'whitelist')}
        />
      )}
    </>
  )
}

export default Create
