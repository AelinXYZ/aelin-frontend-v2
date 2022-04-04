import { isAddress } from '@ethersproject/address'
import { formatEther } from '@ethersproject/units'

import { Privacy } from '@/src/constants/pool'
import { ONE_DAY_IN_SECS, ONE_YEAR_IN_SECS } from '@/src/constants/time'
import { Token } from '@/src/constants/token'
import { CreatePoolSteps } from '@/src/hooks/aelin/useAelinCreatePool'
import { convertToSeconds } from '@/src/utils/date'

export type poolErrors = {
  poolName: string
  poolSymbol: string
  investmentToken: Token
  investmentDeadLine: Duration
  dealDeadline: Duration
  poolCap: string
  sponsorFee: string
  poolPrivacy: Privacy
  whitelist: {
    address: string
    amount: number | null
    isSaved: boolean
  }[]
}

const validateCreatePool = (values: poolErrors) => {
  const errors: any = {}

  if (!values.investmentToken) {
    errors.investmentToken = 'Required'
  } else if (!isAddress(values.investmentToken?.address as string)) {
    errors.investmentToken = 'Invalid Ethereum address'
  }

  if (!values.poolName) {
    errors.poolName = 'Required'
  } else if (values.poolName.length > 15) {
    errors.poolName = 'No more than 15 chars'
  }

  if (!values.poolSymbol) {
    errors.poolSymbol = 'Required'
  } else if (values.poolSymbol.length > 7) {
    errors[CreatePoolSteps.poolSymbol] = 'No more than 7 chars'
  }

  if (Number(formatEther(values.sponsorFee || 0)) > 98) {
    errors.sponsorFee = 'Must be <= 98'
  }

  if (
    !values.investmentDeadLine?.days &&
    !values.investmentDeadLine?.hours &&
    !values.investmentDeadLine?.minutes
  ) {
    errors.investmentDeadLine = 'Required'
  } else {
    const durationSeconds = convertToSeconds({
      days: values.investmentDeadLine?.days ?? 0,
      hours: values.investmentDeadLine?.hours ?? 0,
      minutes: values.investmentDeadLine?.minutes ?? 0,
    })
    if (durationSeconds > ONE_YEAR_IN_SECS) {
      errors.investmentDeadLine = 'Max duration is 365 days'
    }
  }

  if (!values.dealDeadline?.days && !values.dealDeadline?.hours && !values.dealDeadline?.minutes) {
    errors.dealDeadline = 'Required'
  } else {
    const purchaseDurationSeconds = convertToSeconds({
      days: values.dealDeadline?.days ?? 0,
      hours: values.dealDeadline?.hours ?? 0,
      minutes: values.dealDeadline?.days ?? 0,
    })
    if (purchaseDurationSeconds > ONE_DAY_IN_SECS * 30) {
      errors.dealDeadline = 'Max purchase expiry is 30 days'
    }
  }

  if (!values.poolPrivacy) {
    errors.poolPrivacy = 'Select an option'
  }

  return errors
}

export default validateCreatePool
