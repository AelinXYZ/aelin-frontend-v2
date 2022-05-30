import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { wei } from '@synthetixio/wei'

import { Modal } from '../../common/Modal'
import { CardTitle, CardWithTitle } from '@/src/components/common/CardWithTitle'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
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
import DealCalculationModal from '@/src/components/pools/deal/DealCalculationModal'
import DealCreateStepInput from '@/src/components/pools/deal/DealCreateStepInput'
import {
  ButtonPrimaryLight,
  GradientButton,
} from '@/src/components/pureStyledComponents/buttons/Button'
import {
  ButtonNext,
  ButtonPrev,
} from '@/src/components/pureStyledComponents/buttons/ButtonPrevNext'
import { Error } from '@/src/components/pureStyledComponents/text/Error'
import { PageTitle } from '@/src/components/section/PageTitle'
import { StepIndicator as BaseStepIndicator } from '@/src/components/steps/StepIndicator'
import { ChainsValues } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import { Token } from '@/src/constants/token'
import useAelinCreateDeal, {
  CreateDealSteps,
  createDealConfig,
  getCreateDealStepIndicatorData,
  getCreateDealSummaryData,
} from '@/src/hooks/aelin/useAelinCreateDeal'
import useAelinPool from '@/src/hooks/aelin/useAelinPool'
import useAelinPoolStatus from '@/src/hooks/aelin/useAelinPoolStatus'
import { useWarningOnLeavePage } from '@/src/hooks/useWarningOnLeavePage'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { UserRole } from '@/types/aelinPool'

const StepIndicator = styled(BaseStepIndicator)`
  .stepText {
    padding-left: 0;
    padding-right: 0;
  }
`

const CancelButton = styled(ButtonPrimaryLight)`
  margin: 20px auto 0;
  max-width: 100%;
  width: 160px;
`

const BackButton = styled(ButtonPrimaryLight)`
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    display: none;
  }
`

type Props = { poolAddress: string; chainId: ChainsValues }

const CreateDealForm = ({ chainId, poolAddress }: Props) => {
  const router = useRouter()
  const { network } = router.query

  const { pool } = useAelinPool(chainId, poolAddress)
  const { appChainId } = useWeb3Connection()
  const [showDealCalculationModal, setShowDealCalculationModal] = useState(false)
  const [totalPurchase, setTotalPurchase] = useState<string | undefined>('partial')

  const {
    createDealState,
    direction,
    errors,
    handleCreateDeal,
    investmentTokenInfo,
    isFinalStep,
    isFirstStep,
    isSubmitting,
    moveStep,
    setDealField,
    showWarningOnLeave,
  } = useAelinCreateDeal(appChainId, pool)

  const { timeline, userRole } = useAelinPoolStatus(chainId, poolAddress as string)

  const currentStepConfig = createDealConfig[createDealState.currentStep]
  const { order, text, title } = currentStepConfig
  const currentStepError = errors ? errors[createDealState.currentStep] : null
  const disableSubmit = (errors && Object.values(errors).some((err) => !!err)) || isSubmitting

  useWarningOnLeavePage(() => showWarningOnLeave)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Enter' && !currentStepError) {
      moveStep('next')
    }
  }

  const isOpenPeriodDisabled = useMemo(() => {
    try {
      return (
        Number(createDealState.totalPurchaseAmount) ===
        wei(pool.amountInPool.raw, pool.investmentTokenDecimals).toNumber()
      )
    } catch (error) {
      return false
    }
  }, [createDealState.totalPurchaseAmount, pool.amountInPool.raw, pool.investmentTokenDecimals])

  const currentUserIsSponsor = useMemo(() => userRole === UserRole.Sponsor, [userRole])

  useEffect(() => {
    if (isOpenPeriodDisabled && createDealState.currentStep === CreateDealSteps.openPeriod) {
      console.log('asd')
      setDealField({ days: 0, hours: undefined, minutes: undefined })
    }
  }, [createDealState.currentStep, isOpenPeriodDisabled, setDealField])

  return (
    <>
      <Head>
        <title>Deal creation</title>
      </Head>
      <PageTitle subTitle={pool.poolType} title={`${pool.nameFormatted}`} />
      <RightTimelineLayout timelineSteps={timeline}>
        <CardWithTitle titles={<CardTitle>Deal creation</CardTitle>}>
          <StepIndicator
            currentStepOrder={order}
            data={getCreateDealStepIndicatorData(createDealState.currentStep)}
            direction={direction}
          />
          {Object.values(CreateDealSteps).map((step, index) => {
            const isStepVisible = createDealState.currentStep === step

            return !isStepVisible ? null : (
              <WrapperGrid key={index}>
                <PrevNextWrapper>
                  {!isFirstStep && <ButtonPrev onClick={() => moveStep('prev')} />}
                </PrevNextWrapper>
                <StepContents>
                  <Title>{title}</Title>
                  <Description>{text}</Description>
                  <DealCreateStepInput
                    amountInPool={{
                      number: wei(pool.amountInPool.raw, pool.investmentTokenDecimals).toNumber(),
                      formatted: pool.amountInPool.formatted as string,
                    }}
                    currentState={createDealState}
                    isOpenPeriodDisabled={isOpenPeriodDisabled}
                    onCalculateDealModal={() => setShowDealCalculationModal(true)}
                    onKeyUp={handleKeyUp}
                    onSetDealField={setDealField}
                    onSetTotalPurchase={setTotalPurchase}
                    role="none"
                    totalPurchase={totalPurchase}
                  />
                  {createDealState.currentStep === CreateDealSteps.openPeriod &&
                    isOpenPeriodDisabled && (
                      <Error textAlign="center">
                        Open period is bypassed when 100% of tokens have been allocated to
                        investors. Please click next to proceed
                      </Error>
                    )}
                  {currentStepError && typeof currentStepError === 'string' && (
                    <Error textAlign="center">{currentStepError}</Error>
                  )}
                  <ButtonWrapper>
                    <MobileButtonWrapper>
                      <BackButton disabled={isFirstStep} onClick={() => moveStep('prev')}>
                        Back
                      </BackButton>
                      {!isFinalStep ? (
                        <GradientButton
                          disabled={!!currentStepError}
                          onClick={() => moveStep('next')}
                        >
                          Next
                        </GradientButton>
                      ) : (
                        <GradientButton
                          disabled={disableSubmit}
                          key={`${step}_button`}
                          onClick={() => {
                            handleCreateDeal()
                          }}
                        >
                          Create Deal
                        </GradientButton>
                      )}
                    </MobileButtonWrapper>
                  </ButtonWrapper>
                  <Summary data={getCreateDealSummaryData(createDealState, isOpenPeriodDisabled)} />
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
        <Link href={`/pool/${network}/${poolAddress}`} passHref>
          <CancelButton as="a">Cancel</CancelButton>
        </Link>
      </RightTimelineLayout>
      {showDealCalculationModal && (
        <DealCalculationModal
          dealToken={createDealState.dealToken as Token}
          dealTokenAmount={wei(
            createDealState.dealTokenTotal || ZERO_BN,
            createDealState.dealToken?.decimals,
          )}
          investmentToken={investmentTokenInfo as Token}
          onClose={() => setShowDealCalculationModal(false)}
          onConfirm={(value) => {
            setDealField(value)
            setShowDealCalculationModal(false)
          }}
          totalPurchaseAmount={wei(
            createDealState.totalPurchaseAmount,
            pool.investmentTokenDecimals,
          )}
        />
      )}
      {!currentUserIsSponsor && (
        <Modal title="Invalid address">
          <Error textAlign="center">You are not the sponsor of the pool</Error>
        </Modal>
      )}
      {pool.amountInPool.raw.eq(ZERO_BN) && (
        <Modal title="Not possible to create a Deal">
          <Error>
            It's not possible to create a deal for this pool because it didn't receive any funds
            during the investment window. No further action is required.
          </Error>
        </Modal>
      )}
    </>
  )
}

export default genericSuspense(CreateDealForm)
