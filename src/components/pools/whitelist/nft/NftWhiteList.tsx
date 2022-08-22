import { Dispatch, ReactElement } from 'react'
import styled from 'styled-components'

import {
  NftType,
  NftWhiteListAction,
  NftWhiteListActionType,
  NftWhiteListState,
  NftWhiteListStep,
  NftWhitelistProcess,
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
import { Error } from '@/src/components/pureStyledComponents/text/Error'
import { StepIndicator } from '@/src/components/steps/StepIndicator'
import { NftCollectionRulesProps } from '@/src/hooks/aelin/useAelinCreatePool'
import { getParsedNftCollectionRules } from '@/src/utils/aelinPoolUtils'

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
    title: 'Allowlist process',
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
  onConfirm: (nftCollectionRules: NftCollectionRulesProps[], type: NftType) => void
  onClose: () => void
}

const NftWhiteList = ({ dispatch, nftWhiteListState, onClose, onConfirm }: NftWhiteListProps) => {
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
            nftType={nftType}
            selectedCollections={selectedCollections}
            whiteListProcess={whiteListProcess}
          />
        )
    }
  }

  const getError = (): ReactElement | null => {
    if (currentStep !== NftWhiteListStep.nftCollection) {
      return null
    }

    if (nftWhiteListState.selectedCollections[0].nftCollectionData === undefined) {
      return <Error textAlign="center">You should add at least one NFT collection</Error>
    }

    if (
      whiteListProcess === NftWhitelistProcess.limitedPerWallet &&
      nftWhiteListState.selectedCollections
        .filter((selectedCollection) => selectedCollection.nftCollectionData !== undefined)
        .findIndex((selectedCollection) =>
          selectedCollection.amountPerWallet === undefined
            ? true
            : Number(selectedCollection.amountPerWallet) <= 0,
        ) !== -1
    ) {
      return <Error textAlign="center">Amount per wallet should be greater than zero</Error>
    }

    if (
      whiteListProcess === NftWhitelistProcess.limitedPerNft &&
      nftWhiteListState.selectedCollections
        .filter((selectedCollection) => selectedCollection.nftCollectionData !== undefined)
        .findIndex((selectedCollection) =>
          selectedCollection.amountPerNft === undefined
            ? true
            : Number(selectedCollection.amountPerNft) <= 0,
        ) !== -1
    ) {
      return <Error textAlign="center">Amount per NFT should be greater than zero</Error>
    }

    if (whiteListProcess === NftWhitelistProcess.minimumAmount) {
      if (
        nftWhiteListState.selectedCollections
          .filter((selectedCollection) => selectedCollection.nftCollectionData !== undefined)
          .findIndex(
            (selectedCollection) =>
              selectedCollection.selectedNftsData.filter((nftData) => nftData.nftId !== undefined)
                .length === 0,
          ) !== -1
      ) {
        return <Error textAlign="center">You should add at least one ERC-1155 ID</Error>
      }

      if (
        nftWhiteListState.selectedCollections.findIndex(
          (selectedCollection) => selectedCollection.invalidNftIds.size > 0,
        ) !== -1
      ) {
        return <Error textAlign="center">All IDs should be unique</Error>
      }

      if (
        nftWhiteListState.selectedCollections.findIndex(
          (selectedCollection) =>
            selectedCollection.selectedNftsData.findIndex(
              (nftData) => nftData.nftId !== undefined && Number(nftData.minimumAmount) <= 0,
            ) !== -1,
        ) !== -1
      ) {
        return <Error textAlign="center">Minimum amount should be greater than zero</Error>
      }
    }

    return null
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
              {getError()}
              <NextButton
                disabled={getError() !== null}
                onClick={() => {
                  if (isLastStep) {
                    const nftCollectionRules = getParsedNftCollectionRules(nftWhiteListState)

                    onConfirm(nftCollectionRules, nftType)
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
