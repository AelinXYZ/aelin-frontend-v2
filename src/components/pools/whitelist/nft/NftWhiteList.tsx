import { Dispatch } from 'react'
import styled from 'styled-components'

import {
  NftWhiteListAction,
  NftWhiteListActionType,
  NftWhiteListState,
  NftWhiteListStep,
} from '@/src/components/pools/whitelist/nft//nftWhiteListReducer'
import NftCollectionsSection from '@/src/components/pools/whitelist/nft/NftCollectionsSection'
import NftTypeSection from '@/src/components/pools/whitelist/nft/NftTypeSection'
import NftWhiteListProcessSection from '@/src/components/pools/whitelist/nft/NftWhiteListProcessSection'
import {
  ButtonGradient,
  ButtonPrimaryLight,
} from '@/src/components/pureStyledComponents/buttons/Button'
import {
  ButtonNext,
  ButtonPrev,
} from '@/src/components/pureStyledComponents/buttons/ButtonPrevNext'
import { StepIndicator } from '@/src/components/steps/StepIndicator'

const WrapperGrid = styled.div`
  width: 620px;
  display: grid;
  grid-template-columns: 50px 1fr 50px;
`

const StepContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PrevWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-right: 20px;
`

const NextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
`

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 21px;
  max-width: 100%;
  text-align: center;
`

const NftTypeRemark = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.4;
  margin: 40px 0 0;
  max-width: 100%;
  text-align: center;
`

const NextButton = styled(ButtonGradient)`
  min-width: 160px;
  margin-top: 40px;
  margin-bottom: 10px;
`

const CancelButton = styled(ButtonPrimaryLight)`
  min-width: 160px;
`

interface NftWhiteListStepInfo {
  order: number
  title: string
  id: NftWhiteListStep
}

const nftWhiteListStepsConfig: Record<NftWhiteListStep, NftWhiteListStepInfo> = {
  [NftWhiteListStep.nftType]: {
    id: NftWhiteListStep.nftType,
    order: 1,
    title: 'NFT type',
  },
  [NftWhiteListStep.whiteListProcess]: {
    id: NftWhiteListStep.whiteListProcess,
    order: 2,
    title: 'Whitelist process',
  },
  [NftWhiteListStep.nftCollection]: {
    id: NftWhiteListStep.nftCollection,
    order: 3,
    title: 'NFT collection',
  },
}

const getStepIndicatorData = (
  currentStep: NftWhiteListStep,
): { title: string; isActive: boolean }[] =>
  Object.values(NftWhiteListStep).map((step) => ({
    isActive: currentStep === step,
    title: nftWhiteListStepsConfig[step].title,
  }))

type NftWhiteListProps = {
  nftWhiteListState: NftWhiteListState
  dispatch: Dispatch<NftWhiteListAction>
  onClose: () => void
}

const NftWhiteList = ({ dispatch, nftWhiteListState, onClose }: NftWhiteListProps) => {
  const { currentStep, nftType, selectedCollections, whiteListProcess } = nftWhiteListState
  const { order, title } = nftWhiteListStepsConfig[currentStep]

  const getContent = (): JSX.Element => {
    switch (currentStep) {
      case NftWhiteListStep.nftType:
        return (
          <NftTypeSection
            active={nftType}
            onChange={(value) => {
              dispatch({ type: NftWhiteListActionType.updateNftType, payload: value })
            }}
          />
        )
      case NftWhiteListStep.whiteListProcess:
        return (
          <NftWhiteListProcessSection
            active={whiteListProcess}
            nftType={nftType}
            onChange={(value) => {
              dispatch({ type: NftWhiteListActionType.updateWhiteListProcess, payload: value })
            }}
          />
        )
      case NftWhiteListStep.nftCollection:
        return (
          <NftCollectionsSection
            dispatch={dispatch}
            selectedCollections={selectedCollections}
            whiteListProcess={whiteListProcess}
          />
        )
    }
  }

  return (
    <>
      {Object.values(NftWhiteListStep).map((step, index) => {
        const isStepVisible = currentStep === step
        const isFirstStep = nftWhiteListStepsConfig[currentStep].order === 1
        const isLastStep =
          nftWhiteListStepsConfig[currentStep].order === Object.keys(nftWhiteListStepsConfig).length

        const prevStep = Object.values(nftWhiteListStepsConfig).find(
          ({ order }) => order === nftWhiteListStepsConfig[currentStep].order - 1,
        )?.id

        const nextStep = Object.values(nftWhiteListStepsConfig).find(
          ({ order }) => order === nftWhiteListStepsConfig[currentStep].order + 1,
        )?.id

        if (!isStepVisible) return null

        return (
          <WrapperGrid key={index}>
            <PrevWrapper>
              {!isFirstStep && (
                <ButtonPrev
                  onClick={() => {
                    if (prevStep) {
                      dispatch({ type: NftWhiteListActionType.updateStep, payload: prevStep })
                    }
                  }}
                />
              )}
            </PrevWrapper>
            <StepContents>
              <StepIndicator
                currentStepOrder={order}
                data={getStepIndicatorData(currentStep)}
                direction={undefined}
              />
              <Title>{title}</Title>
              {getContent()}
              <NextButton
                onClick={() => {
                  if (isLastStep) {
                    onClose()
                    return
                  }

                  if (nextStep) {
                    dispatch({ type: NftWhiteListActionType.updateStep, payload: nextStep })
                  }
                }}
              >
                {isLastStep ? 'Whitelist' : 'Next'}
              </NextButton>
              <CancelButton onClick={onClose}>Cancel</CancelButton>
              {currentStep === NftWhiteListStep.nftType && (
                <NftTypeRemark>*Including Cryptopunks</NftTypeRemark>
              )}
            </StepContents>
            <NextWrapper>
              {!isLastStep && (
                <ButtonNext
                  onClick={() => {
                    if (nextStep) {
                      dispatch({ type: NftWhiteListActionType.updateStep, payload: nextStep })
                    }
                  }}
                />
              )}
            </NextWrapper>
          </WrapperGrid>
        )
      })}
    </>
  )
}

export default NftWhiteList
