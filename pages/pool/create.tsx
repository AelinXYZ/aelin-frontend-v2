import type { NextPage } from 'next'
import Head from 'next/head'
import styled from 'styled-components'

import { Summary } from '@/src/components/Summary'
import { CardWithTitle } from '@/src/components/common/CardWithTitle'
import { PageTitle } from '@/src/components/common/PageTitle'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import PoolCreateStepInput from '@/src/components/pools/PoolCreateStepInput'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { StepIndicator } from '@/src/components/timeline/StepIndicator'
import useAelinCreatePool, {
  CreatePoolSteps,
  createPoolConfig,
  getCreatePoolStepIndicatorData,
  getCreatePoolSummaryData,
} from '@/src/hooks/aelin/useAelinCreatePool'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const WrapperGrid = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: 30px 1fr 30px;
  width: 100%;
`

const StepContents = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 18px;
  max-width: 100%;
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
  text-align: center;
  width: 690px;
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
      <Head>Create Pool</Head>
      <PageTitle title={'Create pool'} />
      <RightTimelineLayout timeline={<>Right timeline</>}>
        <CardWithTitle title={'Pool creation'}>
          <StepIndicator
            currentStepOrder={order}
            data={getCreatePoolStepIndicatorData(createPoolState.currentStep)}
          />
          <Title>{title}</Title>
          <Description>{text}</Description>
          {Object.values(CreatePoolSteps).map((step) => {
            const isStepVisible = createPoolState.currentStep === step

            return !isStepVisible ? null : (
              <WrapperGrid>
                {
                  <button disabled={isFirstStep} onClick={() => moveStep('prev')}>
                    Prev
                  </button>
                }
                <StepContents>
                  <PoolCreateStepInput
                    currentState={createPoolState}
                    key={step}
                    setPoolField={setPoolField}
                  />
                  {/* {currentStepError && <p>{currentStepError}</p>} */}
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
                  <Summary data={getCreatePoolSummaryData(createPoolState)} />
                </StepContents>
                {isFirstStep && !currentStepError && (
                  <button onClick={() => moveStep('next')}>Next</button>
                )}
              </WrapperGrid>
            )
          })}
        </CardWithTitle>
      </RightTimelineLayout>
    </>
  )
}

export default CreatePool
