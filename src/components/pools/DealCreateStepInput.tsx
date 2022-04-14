import { HMSInput } from '@/src/components/pools/HMSInput'
import TokenDropdown from '@/src/components/pools/TokenDropdown'
import { Textfield } from '@/src/components/pureStyledComponents/form/Textfield'
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
      return (
        <TokenDropdown
          onChange={(token) => setDealField(token)}
          placeholder={createDealConfig[step].placeholder}
          tokenSelected={currentState[CreateDealSteps.dealToken]}
        />
      )
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
    case CreateDealSteps.totalPurchaseAmount:
      return (
        <Textfield
          name={step}
          onChange={(e) => setDealField(e.target.value)}
          placeholder={createDealConfig[step].placeholder}
          type="number"
          value={currentState[step]}
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
