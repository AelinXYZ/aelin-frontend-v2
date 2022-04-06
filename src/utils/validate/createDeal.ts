import { Duration } from 'date-fns'

export type dealErrors = {
  dealToken: string
  dealTokenTotal: string
  totalPurchaseAmount: string
  vestingCliff: Duration
  vestingPeriod: Duration
  proRataPeriod: Duration
  openPeriod: Duration
  counterPartyFundingPeriod: Duration
  counterPartyAddress: string
}

const validateCreateDeal = (values: dealErrors) => {
  const errors: any = {}

  return errors
}

export default validateCreateDeal
