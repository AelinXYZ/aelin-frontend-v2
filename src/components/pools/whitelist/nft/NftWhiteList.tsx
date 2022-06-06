import { Dispatch } from 'react'
import styled from 'styled-components'

import { StepContents } from '@/src/components/pools/common/Create'
import {
  NftWhiteListAction,
  NftWhiteListState,
  NftWhiteListStep,
} from '@/src/components/pools/whitelist/nft//nftWhiteListReducer'
import NftCollectionsSection from '@/src/components/pools/whitelist/nft/NftCollectionsSection'
import NftTypeSection from '@/src/components/pools/whitelist/nft/NftTypeSection'
import NftWhiteListProcessSection from '@/src/components/pools/whitelist/nft/NftWhiteListProcessSection'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { StepIndicator } from '@/src/components/steps/StepIndicator'

const Wrapper = styled.div`
  width: 620px;
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

const Button = styled(GradientButton)`
  margin-top: 40px;
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
              dispatch({ type: 'updateNftType', payload: value })
            }}
          />
        )
      case NftWhiteListStep.whiteListProcess:
        return (
          <NftWhiteListProcessSection
            active={whiteListProcess}
            nftType={nftType}
            onChange={(value) => {
              dispatch({ type: 'updateWhiteListProcess', payload: value })
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
    <Wrapper>
      <StepIndicator
        currentStepOrder={order}
        data={getStepIndicatorData(currentStep)}
        direction={undefined}
      />
      {Object.values(NftWhiteListStep).map((step, index) => {
        const isStepVisible = currentStep === step
        const isLastStep =
          nftWhiteListStepsConfig[currentStep].order === Object.keys(nftWhiteListStepsConfig).length

        if (!isStepVisible) return null

        return (
          <StepContents key={index}>
            <Title>{title}</Title>
            {getContent()}
            <Button
              onClick={() => {
                if (isLastStep) {
                  onClose()
                  return
                }

                const nextStep = Object.values(nftWhiteListStepsConfig).find(
                  ({ order }) => order === nftWhiteListStepsConfig[currentStep].order + 1,
                )?.id
                if (nextStep) {
                  dispatch({ type: 'updateStep', payload: nextStep })
                }
              }}
            >
              {isLastStep ? 'Whitelist' : 'Next'}
            </Button>
            {currentStep === NftWhiteListStep.nftType && (
              <NftTypeRemark>*Including Cryptopunks</NftTypeRemark>
            )}
          </StepContents>
        )
      })}
    </Wrapper>
  )
}

export default NftWhiteList
