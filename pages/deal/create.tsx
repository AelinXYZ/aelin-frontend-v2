import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import styled from 'styled-components'

import { formatUnits } from '@ethersproject/units'

import { CardTitle, CardWithTitle } from '@/src/components/common/CardWithTitle'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import {
  ButtonWrapper,
  MobileButtonWrapper,
  PrevNextWrapper,
  StepContents,
  Title,
  WrapperGrid,
} from '@/src/components/pools/common/Create'
import DealCreateStepInput from '@/src/components/pools/common/DealCreateStepInput'
import { Summary } from '@/src/components/pools/common/Summary'
import NftCollectionsTable from '@/src/components/pools/nftTable/NftCollectionsTable'
import WhiteListModal from '@/src/components/pools/whitelist/WhiteListModal'
import { AddressWhitelistProps } from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
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
import useAelinCreateUpFrontDeal, {
  CreateUpFrontDealSteps,
  NftCollectionRulesProps,
  createDealConfig,
  getCreateDealStepIndicatorData,
  getCreateDealSummaryData,
} from '@/src/hooks/aelin/useAelinCreateUpFrontDeal'
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
    createDealState,
    direction,
    errors,
    handleCreateUpFrontDeal,
    isFinalStep,
    isFirstStep,
    isSubmitting,
    moveStep,
    setDealField,
    showWarningOnLeave,
  } = useAelinCreateUpFrontDeal(appChainId)
  const [showWhiteListModal, setShowWhiteListModal] = useState<boolean>(false)
  const currentStepConfig = createDealConfig[createDealState.currentStep as CreateUpFrontDealSteps]
  const { order, title } = currentStepConfig
  const currentStepError = errors
    ? errors[createDealState.currentStep as CreateUpFrontDealSteps]
    : null
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

  const timeline = useTimelineStatus(undefined, true)

  const withTitle = [
    CreateUpFrontDealSteps.vestingSchedule,
    CreateUpFrontDealSteps.dealAttributes,
  ].some((step) => createDealState.currentStep === step)

  const handleConfirm = (
    whitelist: Array<AddressWhitelistProps | NftCollectionRulesProps>,
    type: NftType | string,
  ) => {
    setDealField(whitelist, type)
    setDealField(true, 'withMerkleTree')

    /*
      TODO: we need to review the private pool logic to enable this code again.
      if (whitelist.length > MAX_PRIVATE_ROWS) {
        setDealField(true, 'withMerkleTree')
      } else {
        setDealField(false, 'withMerkleTree')
      }
    */

    if (createDealState.dealPrivacy === Privacy.PRIVATE && whitelist.length) {
      const investmentTokenToRaise = whitelist.reduce((accum: number, curr: any) => {
        if (curr.amount) {
          accum += curr.amount
        }

        return accum
      }, 0)

      setDealField(
        formatUnits(
          investmentTokenToRaise.toLocaleString('en', { useGrouping: false }),
          createDealState.investmentToken?.decimals,
        ),
        'exchangeRates.investmentTokenToRaise',
      )
    }
  }

  return (
    <>
      <Head>
        <title>{`${createDealState.dealAttributes.name || 'Create deal'}`}</title>
      </Head>
      <PageTitle title={`${createDealState.dealAttributes.name || 'Deal creation'}`} />
      <RightTimelineLayout timelineSteps={timeline}>
        <CardWithTitle titles={<CardTitle>Deal creation</CardTitle>}>
          <StepIndicator
            currentStepOrder={order}
            data={getCreateDealStepIndicatorData(createDealState.currentStep)}
            direction={direction}
          />
          {Object.values(CreateUpFrontDealSteps).map((step, index) => {
            const isStepVisible = createDealState.currentStep === step

            if (!isStepVisible) return null

            return (
              <WrapperGrid key={index}>
                <PrevNextWrapper>
                  {!isFirstStep && <ButtonPrev onClick={() => moveStep('prev')} />}
                </PrevNextWrapper>
                <StepContents>
                  {!withTitle && <Title>{title}</Title>}

                  <DealCreateStepInput
                    currentState={createDealState}
                    key={step}
                    onKeyUp={handleKeyUp}
                    role="none"
                    setDealField={setDealField}
                  />

                  {currentStepError && typeof currentStepError === 'string' && (
                    <StyledError textAlign="center">{currentStepError}</StyledError>
                  )}

                  <ButtonWrapper>
                    {createDealState.currentStep === CreateUpFrontDealSteps.dealPrivacy &&
                      createDealState.dealPrivacy === Privacy.PRIVATE && (
                        <ButtonPrimaryLight onClick={() => setShowWhiteListModal(true)}>
                          Edit allowlisted addresses
                        </ButtonPrimaryLight>
                      )}
                    {createDealState.currentStep === CreateUpFrontDealSteps.dealPrivacy &&
                      createDealState.dealPrivacy === Privacy.NFT && (
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
                          disabled={disableSubmit}
                          key={`${step}_button`}
                          onClick={() => {
                            handleCreateUpFrontDeal()
                          }}
                        >
                          Create deal
                        </ButtonGradient>
                      ) : (
                        <ButtonGradient
                          disabled={!!currentStepError}
                          key={`${step}_button`}
                          onClick={() => moveStep('next')}
                        >
                          Next
                        </ButtonGradient>
                      )}
                    </MobileButtonWrapper>
                  </ButtonWrapper>
                  <Summary data={getCreateDealSummaryData(createDealState)} />
                  {createDealState.dealPrivacy === 'nft' && !!createDealState.investmentToken && (
                    <NftTableWrapper>
                      <NftCollectionsTable
                        light
                        nftCollectionsData={{
                          ...nftWhiteListState,
                          ...createDealState.investmentToken,
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
          currentList={createDealState.whitelist}
          onClose={() => setShowWhiteListModal(false)}
          onConfirm={handleConfirm}
          poolPrivacy={createDealState.dealPrivacy}
          withMerkleTree={true}
        />
      )}
    </>
  )
}

export default Create
