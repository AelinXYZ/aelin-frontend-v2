import { isAddress } from '@ethersproject/address'

import { ChainsValues, chainsConfig } from '@/src/constants/chains'
import { ONE_DAY_IN_SECS, ONE_MINUTE_IN_SECS, ONE_YEAR_IN_SECS } from '@/src/constants/time'
import { CreatePoolState, CreatePoolSteps } from '@/src/hooks/aelin/useAelinCreatePool'
import { convertToSeconds } from '@/src/utils/date'

export type poolErrors = {
  [CreatePoolSteps.PoolName]: string
  [CreatePoolSteps.PoolSymbol]: string
  [CreatePoolSteps.InvestmentToken]: string
  [CreatePoolSteps.InvestmentDeadLine]: string
  [CreatePoolSteps.DealDeadline]: string
  [CreatePoolSteps.PoolCap]: string
  [CreatePoolSteps.SponsorFee]: string
  [CreatePoolSteps.PoolPrivacy]: string
  whiteList: string
}

const validateCreatePool = (values: CreatePoolState, chainId: ChainsValues): poolErrors => {
  const network = chainsConfig[chainId]
  const errors: any = {}

  if (!values[CreatePoolSteps.InvestmentToken]) {
    errors[CreatePoolSteps.InvestmentToken] = 'Required'
  } else if (!isAddress(values[CreatePoolSteps.InvestmentToken]?.address as string)) {
    errors[CreatePoolSteps.InvestmentToken] = 'Invalid Ethereum address'
  }

  if (!values[CreatePoolSteps.PoolName]) {
    errors[CreatePoolSteps.PoolName] = 'Required'
  } else if (values[CreatePoolSteps.PoolName].length > 15) {
    errors[CreatePoolSteps.PoolName] = 'No more than 15 chars'
  }

  if (!values[CreatePoolSteps.PoolSymbol]) {
    errors[CreatePoolSteps.PoolSymbol] = 'Required'
  } else if (values[CreatePoolSteps.PoolSymbol].length > 7) {
    errors[CreatePoolSteps.PoolSymbol] = 'No more than 7 chars'
  }

  if (Number(values[CreatePoolSteps.SponsorFee]) > 98) {
    errors[CreatePoolSteps.SponsorFee] = 'Must be <= 98'
  }

  if (
    !values[CreatePoolSteps.InvestmentDeadLine]?.days &&
    !values[CreatePoolSteps.InvestmentDeadLine]?.hours &&
    !values[CreatePoolSteps.InvestmentDeadLine]?.minutes
  ) {
    errors[CreatePoolSteps.InvestmentDeadLine] = 'Required'
  } else {
    const durationSeconds = convertToSeconds({
      days: values[CreatePoolSteps.InvestmentDeadLine]?.days ?? 0,
      hours: values[CreatePoolSteps.InvestmentDeadLine]?.hours ?? 0,
      minutes: values[CreatePoolSteps.InvestmentDeadLine]?.minutes ?? 0,
    })
    if (durationSeconds > ONE_YEAR_IN_SECS) {
      errors[CreatePoolSteps.InvestmentDeadLine] = 'Max duration is 365 days'
    }
  }

  if (
    !values[CreatePoolSteps.DealDeadline]?.days &&
    !values[CreatePoolSteps.DealDeadline]?.hours &&
    !values[CreatePoolSteps.DealDeadline]?.minutes
  ) {
    errors[CreatePoolSteps.DealDeadline] = 'Required'
  } else {
    const purchaseDurationSeconds = convertToSeconds({
      days: values[CreatePoolSteps.DealDeadline]?.days ?? 0,
      hours: values[CreatePoolSteps.DealDeadline]?.hours ?? 0,
      minutes: values[CreatePoolSteps.DealDeadline]?.days ?? 0,
    })
    if (purchaseDurationSeconds > ONE_DAY_IN_SECS * 30) {
      errors[CreatePoolSteps.DealDeadline] = 'Max purchase expiry is 30 days'
    } else if (
      !network.isProd
        ? purchaseDurationSeconds < ONE_MINUTE_IN_SECS
        : purchaseDurationSeconds < ONE_MINUTE_IN_SECS * 30
    ) {
      errors[CreatePoolSteps.DealDeadline] = 'Min purchase expiry is 30 mins'
    }
  }

  if (!values[CreatePoolSteps.PoolPrivacy]) {
    errors[CreatePoolSteps.PoolPrivacy] = 'Select an option'
  }

  return errors
}

export default validateCreatePool
