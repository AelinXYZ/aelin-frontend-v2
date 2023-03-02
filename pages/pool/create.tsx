import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import styled from 'styled-components'

import { CardTitle, CardWithTitle } from '@/src/components/common/CardWithTitle'
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
import PoolCreateStepInput from '@/src/components/pools/common/PoolCreateStepInput'
import { Summary } from '@/src/components/pools/common/Summary'
import NftCollectionsTable from '@/src/components/pools/nftTable/NftCollectionsTable'
import WhiteListModal from '@/src/components/pools/whitelist/WhiteListModal'
import {
  AddressWhitelistProps,
  AddressesWhiteListAmountFormat,
} from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
import { NftType } from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import {
  ButtonGradient,
  ButtonPrimaryLight,
} from '@/src/components/pureStyledComponents/buttons/Button'
import {
  ButtonNext,
  ButtonPrev,
} from '@/src/components/pureStyledComponents/buttons/ButtonPrevNext'
import { Error } from '@/src/components/pureStyledComponents/text/Error'
import { PageTitle } from '@/src/components/section/PageTitle'
import { StepIndicator } from '@/src/components/steps/StepIndicator'
import { Privacy } from '@/src/constants/pool'
import useAelinCreatePool, {
  CreatePoolSteps,
  NftCollectionRulesProps,
  createPoolConfig,
  getCreatePoolStepIndicatorData,
  getCreatePoolSummaryData,
} from '@/src/hooks/aelin/useAelinCreatePool'
import { useTimelineStatus } from '@/src/hooks/aelin/useAelinPoolStatus'
import { useWarningOnLeavePage } from '@/src/hooks/useWarningOnLeavePage'
import { useNftCreationState } from '@/src/providers/nftCreationState'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const BackButton = styled(ButtonPrimaryLight)`
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    display: none;
  }
`

const StyledError = styled(Error)`
  margin-bottom: 0;
`

const NftTableWrapper = styled.div`
  width: 100%;
  padding-top: 20px;
`

const Create: NextPage = () => {
  const { appChainId } = useWeb3Connection()
  const {
    createPoolState,
    direction,
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
  const { nftWhiteListState } = useNftCreationState()
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
            direction={direction}
          />
          {Object.values(CreatePoolSteps).map((step, index) => {
            const isStepVisible = createPoolState.currentStep === step

            if (!isStepVisible) return null

            return (
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
                    <StyledError textAlign="center">{currentStepError}</StyledError>
                  )}

                  <ButtonWrapper>
                    {isFinalStep && createPoolState.poolPrivacy === Privacy.PRIVATE && (
                      <ButtonPrimaryLight onClick={() => setShowWhiteListModal(true)}>
                        Edit allowlisted addresses
                      </ButtonPrimaryLight>
                    )}
                    {isFinalStep && createPoolState.poolPrivacy === Privacy.NFT && (
                      <ButtonPrimaryLight onClick={() => setShowWhiteListModal(true)}>
                        Edit collections
                      </ButtonPrimaryLight>
                    )}

                    <MobileButtonWrapper>
                      <BackButton disabled={isFirstStep} onClick={() => moveStep('prev')}>
                        Back
                      </BackButton>
                      {isFinalStep ? (
                        <ButtonGradient
                          data-cy="pool-create-btn"
                          disabled={disableSubmit}
                          key={`${step}_button`}
                          onClick={() => {
                            handleCreatePool()
                          }}
                        >
                          Create Pool
                        </ButtonGradient>
                      ) : (
                        <ButtonGradient
                          data-cy="pool-create-next-btn"
                          disabled={!!currentStepError}
                          key={`${step}_button`}
                          onClick={() => moveStep('next')}
                        >
                          Next
                        </ButtonGradient>
                      )}
                    </MobileButtonWrapper>
                  </ButtonWrapper>
                  <Summary data={getCreatePoolSummaryData(createPoolState)} />
                  {createPoolState.poolPrivacy === 'nft' && !!createPoolState.investmentToken && (
                    <NftTableWrapper>
                      <NftCollectionsTable
                        light
                        nftCollectionsData={{
                          ...nftWhiteListState,
                          ...createPoolState.investmentToken,
                        }}
                      />
                    </NftTableWrapper>
                  )}
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
          currentAmountFormat={createPoolState.whiteListAmountFormat}
          currentList={createPoolState.whitelist}
          onClose={() => setShowWhiteListModal(false)}
          onConfirm={(
            whitelist: AddressWhitelistProps[] | NftCollectionRulesProps[],
            type: NftType | string,
            amountFormat?: AddressesWhiteListAmountFormat,
          ) => {
            setPoolField(whitelist, type)

            if (amountFormat) {
              setPoolField(amountFormat, 'whiteListAmountFormat')
            }
          }}
          poolPrivacy={createPoolState.poolPrivacy}
          withMerkleTree={false}
        />
      )}
    </>
  )
}

export default Create
