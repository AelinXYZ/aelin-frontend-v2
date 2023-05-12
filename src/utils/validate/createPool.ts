import { isAddress } from '@ethersproject/address'

import { AddressWhitelistProps } from '@/src/components/pools/whitelist/addresses/types'
import { NftType } from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { POOL_NAME_MAX_LENGTH } from '@/src/constants/misc'
import { Privacy } from '@/src/constants/pool'
import { ONE_DAY_IN_SECS, ONE_MINUTE_IN_SECS, ONE_YEAR_IN_SECS } from '@/src/constants/time'
import { Token } from '@/src/constants/token'
import { CreatePoolSteps } from '@/src/hooks/aelin/useAelinCreatePool'
import { convertToSeconds } from '@/src/utils/date'

export type poolErrors = {
  poolName?: string
  poolSymbol?: string
  investmentToken?: Token
  investmentDeadLine?: Duration
  dealDeadline?: Duration
  poolCap?: number
  sponsorFee?: number
  poolPrivacy?: Privacy
  whitelist?: AddressWhitelistProps[]
}

const validateCreatePool = (values: poolErrors, chainId: ChainsValues) => {
  const errors: any = {}

  const currentNetwork = getNetworkConfig(chainId)

  if (!values.investmentToken) {
    errors.investmentToken = true
  } else if (!isAddress(values.investmentToken?.address as string)) {
    errors.investmentToken = 'Invalid Ethereum address'
  }

  if (!values.poolName) {
    errors.poolName = true
  } else if (values.poolName.length > POOL_NAME_MAX_LENGTH) {
    errors.poolName = 'No more than 30 chars'
  }

  if (!values.poolSymbol) {
    errors.poolSymbol = true
  } else if (values.poolSymbol.length > 7) {
    errors[CreatePoolSteps.poolSymbol] = 'No more than 7 chars'
  }

  if (Number(values.sponsorFee) > 15) {
    errors.sponsorFee = 'Must be <= 15'
  }

  if (
    !values.investmentDeadLine?.days &&
    !values.investmentDeadLine?.hours &&
    !values.investmentDeadLine?.minutes
  ) {
    errors.investmentDeadLine = true
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
    errors.dealDeadline = true
  } else {
    const dealDeadlineSeconds = convertToSeconds({
      days: values.dealDeadline?.days ?? 0,
      hours: values.dealDeadline?.hours ?? 0,
      minutes: values.dealDeadline?.minutes ?? 0,
    })
    if (dealDeadlineSeconds > ONE_YEAR_IN_SECS) {
      errors.dealDeadline = 'Max duration is 365 days'
    }
  }

  if (!values.poolPrivacy) {
    errors.poolPrivacy = true
  }

  if (values.poolPrivacy === Privacy.PRIVATE && !values.whitelist?.length) {
    errors.poolPrivacy = 'Add addresses or change pool access to public'
  }

  if (
    values.poolPrivacy === Privacy.NFT &&
    !Object.hasOwn(values, NftType.erc721) &&
    !Object.hasOwn(values, NftType.erc1155)
  ) {
    errors.poolPrivacy = 'Add collections or change pool access to public'
  }

  if (!values.sponsorFee || values.sponsorFee < 0) {
    errors.sponsorFee = true
  }

  if (values.poolCap === undefined) {
    errors.poolCap = true
  }

  return errors
}

export default validateCreatePool
