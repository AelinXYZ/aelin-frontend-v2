import { isAddress } from '@ethersproject/address'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'
import Wei, { wei } from '@synthetixio/wei'
import { Duration } from 'date-fns'

import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import { ONE_DAY_IN_SECS, ONE_MINUTE_IN_SECS } from '@/src/constants/time'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { convertToSeconds, isEmptyDuration } from '@/src/utils/date'

export type dealErrors = {
  dealToken?: string
  dealTokenTotal?: BigNumberish
  totalPurchaseAmount?: string
  vestingCliff?: Duration
  vestingPeriod?: Duration
  proRataPeriod?: Duration
  openPeriod?: Duration
  counterPartyFundingPeriod?: Duration
  counterPartyAddress?: string
}

const validateCreateDeal = (values: dealErrors, pool: ParsedAelinPool, chainId: ChainsValues) => {
  const errors: any = {}

  const currentNetwork = getNetworkConfig(chainId)

  const currentTotalPurchaseAmount = wei(
    values.totalPurchaseAmount || '0',
    pool.investmentTokenDecimals,
  )

  if (!values.dealToken) {
    errors.dealToken = true
  }

  if (currentTotalPurchaseAmount.lte(wei(0))) {
    errors.totalPurchaseAmount = true
  } else if (currentTotalPurchaseAmount.gt(pool.amountInPool.raw)) {
    errors.totalPurchaseAmount = `Max is ${pool.amountInPool.formatted}`
  }

  if (!values.dealTokenTotal || Number(values.dealTokenTotal) <= 0) {
    errors.dealTokenTotal = true
  }

  if (!values.counterPartyAddress) {
    errors.counterPartyAddress = true
  } else if (!isAddress(values.counterPartyAddress)) {
    errors.counterPartyAddress = 'Invalid Ethereum address'
  }

  if (isEmptyDuration(values.vestingCliff)) {
    errors.vestingCliff = true
  }

  if (isEmptyDuration(values.vestingPeriod)) {
    errors.vestingPeriod = true
  }

  if (
    !values.proRataPeriod?.days &&
    !values.proRataPeriod?.hours &&
    !values.proRataPeriod?.minutes
  ) {
    errors.proRataPeriod = true
  } else {
    const proRataPeriodSeconds = convertToSeconds({
      days: values.proRataPeriod?.days ?? 0,
      hours: values.proRataPeriod?.hours ?? 0,
      minutes: values.proRataPeriod?.minutes ?? 0,
    })
    if (proRataPeriodSeconds > ONE_DAY_IN_SECS * 30) {
      errors.proRataPeriod = 'Max pro rata period is 30 days'
    } else if (
      !currentNetwork.isProd
        ? proRataPeriodSeconds < ONE_MINUTE_IN_SECS // min pro rata period in test networks 1 min
        : proRataPeriodSeconds < ONE_MINUTE_IN_SECS * 30 // min pro rata period in main networks 30 min
    ) {
      errors.proRataPeriod = 'Min pro rata period is 30 mins'
    }
  }

  const noOpenValues =
    !values.openPeriod?.days && !values.openPeriod?.hours && !values.openPeriod?.minutes

  const isTotalPurchaseAmountEqualToAmountInPool = wei(
    pool.amountInPool.raw,
    pool.investmentTokenDecimals,
  ).eq(currentTotalPurchaseAmount)

  if (values.totalPurchaseAmount && isTotalPurchaseAmountEqualToAmountInPool && !noOpenValues) {
    errors.openPeriod = 'Pool supply maxed. Set open period to 0'
  } else if (!isTotalPurchaseAmountEqualToAmountInPool && noOpenValues) {
    errors.openPeriod = true
  } else {
    const openRedemptionSeconds = convertToSeconds({
      days: values.openPeriod?.days ?? 0,
      hours: values.openPeriod?.hours ?? 0,
      minutes: values.openPeriod?.minutes ?? 0,
    })
    if (openRedemptionSeconds > ONE_DAY_IN_SECS * 30) {
      errors.openPeriod = 'Max open is 30 days'
    } else if (
      !currentNetwork.isProd
        ? openRedemptionSeconds < ONE_MINUTE_IN_SECS * 1 &&
          !isTotalPurchaseAmountEqualToAmountInPool
        : openRedemptionSeconds < ONE_MINUTE_IN_SECS * 30 &&
          !isTotalPurchaseAmountEqualToAmountInPool
    ) {
      errors.openRedemptionMinutes = 'Min open period is 30 mins'
    }
  }

  if (
    !values.counterPartyFundingPeriod?.days &&
    !values.counterPartyFundingPeriod?.hours &&
    !values.counterPartyFundingPeriod?.minutes
  ) {
    errors.counterPartyFundingPeriod = true
  } else {
    const counterPartyFundingPeriodSeconds = convertToSeconds({
      days: values.counterPartyFundingPeriod?.days ?? 0,
      hours: values.counterPartyFundingPeriod?.hours ?? 0,
      minutes: values.counterPartyFundingPeriod?.minutes ?? 0,
    })
    if (counterPartyFundingPeriodSeconds > ONE_DAY_IN_SECS * 30) {
      errors.counterPartyFundingPeriod = 'Max counter party funding period is 30 days'
    } else if (
      !currentNetwork.isProd
        ? counterPartyFundingPeriodSeconds < ONE_MINUTE_IN_SECS // min counterparty funding period in test networks 1 min
        : counterPartyFundingPeriodSeconds < ONE_MINUTE_IN_SECS * 30 // min counterparty funding period in main networks 30 min
    ) {
      errors.counterPartyFundingPeriod = 'Min Max counter party funding period is 30 mins'
    }
  }

  return errors
}

export default validateCreateDeal
