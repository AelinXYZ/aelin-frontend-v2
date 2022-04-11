import { isAddress } from '@ethersproject/address'
import { formatEther } from '@ethersproject/units'

import { ChainsValues, chainsConfig, getNetworkConfig } from '@/src/constants/chains'
import { Privacy } from '@/src/constants/pool'
import { ONE_DAY_IN_SECS, ONE_MINUTE_IN_SECS, ONE_YEAR_IN_SECS } from '@/src/constants/time'
import { Token } from '@/src/constants/token'
import { CreatePoolSteps } from '@/src/hooks/aelin/useAelinCreatePool'
import { convertToSeconds } from '@/src/utils/date'

export type poolErrors = {
  poolName: string
  poolSymbol: string
  investmentToken: Token
  investmentDeadLine: Duration
  dealDeadline: Duration
  poolCap: number
  sponsorFee: number
  poolPrivacy: Privacy
  whitelist: {
    address: string
    amount: number | null
    isSaved: boolean
  }[]
}

const validateCreatePool = (values: poolErrors, chainId: ChainsValues) => {
  const errors: any = {}

  const currentNetwork = getNetworkConfig(chainId)

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

  if (Number(values.sponsorFee) > 98) {
    errors.sponsorFee = 'Must be <= 98'
  }

  if (
    !values.investmentDeadLine?.days &&
    !values.investmentDeadLine?.hours &&
    !values.investmentDeadLine?.minutes
  ) {
    errors.investmentDeadLine = 'Required'
  } else {
    const investmentDeadLineSeconds = convertToSeconds({
      days: values.investmentDeadLine?.days ?? 0,
      hours: values.investmentDeadLine?.hours ?? 0,
      minutes: values.investmentDeadLine?.minutes ?? 0,
    })
    if (investmentDeadLineSeconds > ONE_DAY_IN_SECS * 30) {
      errors.investmentDeadLine = 'Max purchase expiry is 30 days'
    } else if (
      !currentNetwork.isProd
        ? investmentDeadLineSeconds < ONE_MINUTE_IN_SECS // min purchase expiry in test networks 1 min
        : investmentDeadLineSeconds < ONE_MINUTE_IN_SECS * 30 // min purchase expiry in main networks 30 min
    ) {
      errors.investmentDeadLine = 'Min purchase expiry is 30 mins'
    }
  }

  if (!values.dealDeadline?.days && !values.dealDeadline?.hours && !values.dealDeadline?.minutes) {
    errors.dealDeadline = 'Required'
  } else {
    const dealDeadlineSeconds = convertToSeconds({
      days: values.dealDeadline?.days ?? 0,
      hours: values.dealDeadline?.hours ?? 0,
      minutes: values.dealDeadline?.days ?? 0,
    })
    if (dealDeadlineSeconds > ONE_YEAR_IN_SECS) {
      errors.dealDeadline = 'Max duration is 365 days'
    }
  }

  if (!values.poolPrivacy) {
    errors.poolPrivacy = 'Select an option'
  }

  return errors
}

export default validateCreatePool
