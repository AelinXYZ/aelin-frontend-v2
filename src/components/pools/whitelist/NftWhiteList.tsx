import styled from 'styled-components'

import { StepContents } from '@/src/components/pools/common/Create'
import NftCollectionsSection, {
  NftType,
  NftWhitelistProcess,
} from '@/src/components/pools/whitelist/NftCollectionsSection'
import NftTypeSection from '@/src/components/pools/whitelist/NftTypeSection'
import NftWhiteListProcessSection from '@/src/components/pools/whitelist/NftWhiteListProcessSection'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { StepIndicator } from '@/src/components/steps/StepIndicator'

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 21px;
  max-width: 100%;
  text-align: center;
  width: 620px;
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

export enum NftWhiteListStep {
  nftType = 'nftType',
  whiteListProcess = 'whiteListProcess',
  nftCollection = 'nftCollection',
}

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
  currentStep: NftWhiteListStep
  setCurrentStep: (currentStep: NftWhiteListStep) => void
  nftType: NftType
  setNftType: (nftType: NftType) => void
  whiteListProcess: NftWhitelistProcess
  setWhiteListProcess: (whiteListProcess: NftWhitelistProcess) => void
  onClose: () => void
}

const NftWhiteList = ({
  currentStep,
  nftType,
  onClose,
  setCurrentStep,
  setNftType,
  setWhiteListProcess,
  whiteListProcess,
}: NftWhiteListProps) => {
  const { order, title } = nftWhiteListStepsConfig[currentStep]

  const getContent = (): JSX.Element => {
    switch (currentStep) {
      case NftWhiteListStep.nftType:
        return (
          <NftTypeSection
            active={nftType}
            setActive={setNftType}
            setWhitelistProcess={setWhiteListProcess}
          />
        )
      case NftWhiteListStep.whiteListProcess:
        return (
          <NftWhiteListProcessSection
            active={whiteListProcess}
            nftType={nftType}
            setActive={setWhiteListProcess}
          />
        )
      case NftWhiteListStep.nftCollection:
        return <NftCollectionsSection />
    }
  }

  return (
    <>
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
            <GradientButton
              onClick={() => {
                if (isLastStep) {
                  onClose()
                  return
                }

                const nextStep = Object.values(nftWhiteListStepsConfig).find(
                  ({ order }) => order === nftWhiteListStepsConfig[currentStep].order + 1,
                )?.id
                if (nextStep) {
                  setCurrentStep(nextStep)
                }
              }}
            >
              {isLastStep ? 'Whitelist' : 'Next'}
            </GradientButton>
            {currentStep === NftWhiteListStep.nftType && (
              <NftTypeRemark>*Including Cryptopunks</NftTypeRemark>
            )}
          </StepContents>
        )
      })}
    </>
  )
}

export default NftWhiteList
