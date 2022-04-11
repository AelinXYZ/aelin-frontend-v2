import type { NextPage } from 'next'
import Head from 'next/head'
import styled from 'styled-components'

import { CardWithTitle } from '@/src/components/common/CardWithTitle'
import { PageTitle } from '@/src/components/common/PageTitle'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import PoolCreateStepInput from '@/src/components/pools/PoolCreateStepInput'
import { Summary } from '@/src/components/pools/Summary'
import { Timeline } from '@/src/components/pools/Timeline'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import {
  ButtonNext,
  ButtonPrev,
} from '@/src/components/pureStyledComponents/buttons/ButtonPrevNext'
import { StepIndicator } from '@/src/components/timeline/StepIndicator'
import useAelinCreatePool, {
  CreatePoolSteps,
  createPoolConfig,
  getCreatePoolStepIndicatorData,
  getCreatePoolSummaryData,
} from '@/src/hooks/aelin/useAelinCreatePool'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const WrapperGrid = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr 30px;
  width: 100%;
`

const StepContents = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const PrevNextWrapper = styled.div`
  padding-top: 150px;
`

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 18px;
  max-width: 100%;
  padding: 0 20px;
  text-align: center;
  width: 690px;
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.4;
  margin: 0 0 50px;
  max-width: 100%;
  padding: 0 20px;
  text-align: center;
  width: 690px;
`

const ButtonWrapper = styled.div`
  margin-bottom: 40px;
  margin-top: 40px;
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
  const { order, text, title } = currentStepConfig
  const currentStepError = errors ? errors[createPoolState.currentStep] : null
  const disableSubmit = (errors && Object.values(errors).some((err) => !!err)) || isSubmitting

  return (
    <>
      <Head>
        <title>Aelin - Create Pool</title>
      </Head>
      <PageTitle title={'Create pool'} />
      <RightTimelineLayout timeline={<Timeline activeItem={1} />}>
        <CardWithTitle title={'Pool creation'}>
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
                    setPoolField={setPoolField}
                  />
                  {/* {currentStepError && <p>{currentStepError}</p>} */}
                  <ButtonWrapper>
                    {!isFinalStep ? (
                      <GradientButton
                        disabled={!!currentStepError}
                        key={`${step}_button`}
                        onClick={() => moveStep('next')}
                      >
                        Next
                      </GradientButton>
                    ) : (
                      <GradientButton
                        disabled={disableSubmit}
                        key={`${step}_button`}
                        onClick={handleSubmit}
                      >
                        Create Pool
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
    </>
  )
}

export default CreatePool
