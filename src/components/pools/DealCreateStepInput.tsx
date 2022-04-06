import { BigNumberInput } from 'big-number-input'

import { HMSInput } from '@/src/components/HMSInput'
import {
  CreateDealState,
  CreateDealSteps,
  createDealConfig,
} from '@/src/hooks/aelin/useAelinCreateDeal'

const DealCreateStepInput = ({
  currentState,
  setDealField,
}: {
  setDealField: (value: unknown) => void
  currentState: CreateDealState
}) => {
  const step = currentState.currentStep

  switch (step) {
    case CreateDealSteps.dealToken:
    case CreateDealSteps.counterPartyAddress:
      return (
        <input
          maxLength={42}
          name={step}
          onChange={(e) => setDealField(e.target.value)}
          placeholder={createDealConfig[step].placeholder}
          type="text"
          value={currentState[step]}
        />
      )
    case CreateDealSteps.dealTokenTotal:
      return (
        <BigNumberInput
          decimals={18}
          min="0"
          onChange={(value) => setDealField(value)}
          placeholder={createDealConfig[step].placeholder}
          value={currentState[step] ? (currentState[step] as string) : ''}
        />
      )
    case CreateDealSteps.totalPurchaseAmount:
      return (
        <BigNumberInput
          decimals={18}
          min="0"
          onChange={(value) => setDealField(value)}
          placeholder={createDealConfig[step].placeholder}
          value={currentState[step] ? (currentState[step] as string) : ''}
        />
      )
    case CreateDealSteps.counterPartyFundingPeriod:
    case CreateDealSteps.vestingCliff:
    case CreateDealSteps.proRataPeriod:
    case CreateDealSteps.openPeriod:
    case CreateDealSteps.vestingPeriod:
      return (
        <HMSInput defaultValue={currentState[step]} onChange={(value) => setDealField(value)} />
      )
  }
}

export default DealCreateStepInput
