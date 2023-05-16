import { Dispatch, ReactElement, SetStateAction } from 'react'
import styled from 'styled-components'

import { addressesWhiteListStepsConfig } from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
import { AddressesWhiteListStep } from '@/src/components/pools/whitelist/addresses/types'
import {
  ButtonNext,
  ButtonPrev,
} from '@/src/components/pureStyledComponents/buttons/ButtonPrevNext'
import { StepIndicator } from '@/src/components/steps/StepIndicator'

const WrapperGrid = styled.div`
  width: 700px;
  display: grid;
  grid-template-columns: 50px 1fr 50px;
`

const PrevWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-right: 20px;
`

const StepContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
`

type AddressesWhiteListWrapper = {
  children: ReactElement
  currentStep: AddressesWhiteListStep
  setCurrentStep: Dispatch<SetStateAction<AddressesWhiteListStep>>
}

const getStepIndicatorData = (
  currentStep: AddressesWhiteListStep,
): { title: string; isActive: boolean }[] =>
  Object.values(AddressesWhiteListStep).map((step) => ({
    isActive: currentStep === step,
    title: addressesWhiteListStepsConfig[step].title,
  }))

const AddressesListWrapper = ({
  children,
  currentStep,
  setCurrentStep,
}: AddressesWhiteListWrapper) => {
  const { order } = addressesWhiteListStepsConfig[currentStep]

  const isFirstStep = order === 1

  const isLastStep = order === Object.keys(addressesWhiteListStepsConfig).length

  const prevStep = Object.values(addressesWhiteListStepsConfig).find(
    (val) => val.order === order - 1,
  )?.id

  const nextStep = Object.values(addressesWhiteListStepsConfig).find(
    (val) => val.order === order + 1,
  )?.id

  return (
    <WrapperGrid>
      <PrevWrapper>
        {!isFirstStep && (
          <ButtonPrev
            onClick={() => {
              if (prevStep) {
                setCurrentStep(prevStep)
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
        {children}
      </StepContents>

      <NextWrapper>
        {!isLastStep && (
          <ButtonNext
            onClick={() => {
              if (nextStep) {
                setCurrentStep(nextStep)
              }
            }}
          />
        )}
      </NextWrapper>
    </WrapperGrid>
  )
}

export default AddressesListWrapper
