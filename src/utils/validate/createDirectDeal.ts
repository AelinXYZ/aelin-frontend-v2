import { isAddress } from '@ethersproject/address'

import { CSVParseType } from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
import { NftType } from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { POOL_NAME_MAX_LENGTH } from '@/src/constants/misc'
import { Privacy } from '@/src/constants/pool'
import { ONE_DAY_IN_SECS, ONE_MINUTE_IN_SECS } from '@/src/constants/time'
import { Token } from '@/src/constants/token'
import {
  CreateUpFrontDealSteps,
  DealAttr,
  ExchangeRatesAttr,
  VestingScheduleAttr,
} from '@/src/hooks/aelin/useAelinCreateUpFrontDeal'
import { convertToSeconds } from '@/src/utils/date'

export type dealErrors = {
  [CreateUpFrontDealSteps.dealAttributes]: DealAttr
  [CreateUpFrontDealSteps.investmentToken]?: Token
  [CreateUpFrontDealSteps.redemptionDeadline]?: Duration
  [CreateUpFrontDealSteps.sponsorFee]: number
  [CreateUpFrontDealSteps.holderAddress]?: string
  [CreateUpFrontDealSteps.dealToken]?: Token
  [CreateUpFrontDealSteps.exchangeRates]?: ExchangeRatesAttr
  [CreateUpFrontDealSteps.vestingSchedule]?: VestingScheduleAttr
  [CreateUpFrontDealSteps.dealPrivacy]?: Privacy
  whitelist?: CSVParseType[]
}

const validateCreateDirectDeal = (values: dealErrors, chainId: ChainsValues) => {
  const errors: any = {}

  const currentNetwork = getNetworkConfig(chainId)

  if (values.dealAttributes.name == '') {
    errors.dealAttributes = true
  } else if (values.dealAttributes.name.length > POOL_NAME_MAX_LENGTH) {
    errors.dealAttributes = 'No more than 30 chars'
  }

  if (values.dealAttributes?.symbol == '') {
    errors.dealAttributes = true
  } else if (values.dealAttributes.symbol.length > 7) {
    errors.dealAttributes = 'No more than 7 chars'
  }

  if (!values.investmentToken) {
    errors.investmentToken = true
  } else if (!isAddress(values.investmentToken?.address as string)) {
    errors.investmentToken = 'Invalid Ethereum address'
  }

  if (values.sponsorFee < 0) {
    errors.sponsorFee = true
  }

  if (Number(values.sponsorFee) > 15) {
    errors.sponsorFee = 'Must be <= 15'
  }

  if (!values.holderAddress) {
    errors.holderAddress = true
  } else if (!isAddress(values.holderAddress as string)) {
    errors.holderAddress = 'Invalid ethereum address'
  }

  if (
    !values.redemptionDeadline?.days &&
    !values.redemptionDeadline?.hours &&
    !values.redemptionDeadline?.minutes
  ) {
    errors.redemptionDeadline = true
  } else {
    const redemptionDeadLineSeconds = convertToSeconds({
      days: values.redemptionDeadline?.days ?? 0,
      hours: values.redemptionDeadline?.hours ?? 0,
      minutes: values.redemptionDeadline?.minutes ?? 0,
    })

    if (redemptionDeadLineSeconds > ONE_DAY_IN_SECS * 30) {
      errors.redemptionDeadline = 'Max redemption deadline is 30 days'
    } else if (
      !currentNetwork.isProd
        ? redemptionDeadLineSeconds < ONE_MINUTE_IN_SECS
        : redemptionDeadLineSeconds < ONE_MINUTE_IN_SECS * 30
    ) {
      errors.investmentDeadLine = 'Min redemption deadline is 30 mins'
    }
  }

  if (!values.dealToken) {
    errors.dealToken = true
  } else if (!isAddress(values.dealToken.address as string)) {
    errors.dealToken = 'Invalid ethereum address'
  }

  if (!values.dealPrivacy) {
    errors.dealPrivacy = true
  } else if (values.dealPrivacy === Privacy.PRIVATE && !values.whitelist?.length) {
    errors.dealPrivacy = 'Add addresses or change pool access to public'
  } else if (
    values.dealPrivacy === Privacy.NFT &&
    !Object.hasOwn(values, NftType.erc721) &&
    !Object.hasOwn(values, NftType.erc1155)
  ) {
    errors.dealPrivacy = 'Add collections or change pool access to public'
  }

  if (
    !values.exchangeRates?.investmentTokenToRaise &&
    !values.exchangeRates?.exchangeRates &&
    !values.exchangeRates?.hasDealMinimum &&
    !values.exchangeRates?.minimumAmount
  ) {
    errors.exchangeRates = true
  } else {
    if (!values.exchangeRates?.investmentTokenToRaise) {
      errors.exchangeRates = 'Set how much you want to raise'
    } else {
      if (values.exchangeRates?.investmentTokenToRaise <= 0) {
        errors.exchangeRates = 'The investment has to be greater than zero'
      } else {
        if (!values.exchangeRates?.exchangeRates) {
          errors.exchangeRates = 'Set an exchange rate'
        } else {
          if (Number(values.exchangeRates?.exchangeRates) <= 0) {
            errors.exchangeRates = 'The exchange rate has to be greater than zero'
          } else {
            if (values.exchangeRates?.hasDealMinimum) {
              if (!values.exchangeRates?.minimumAmount) {
                errors.exchangeRates = 'Invalid minimum amount'
              } else if (
                Number(values.exchangeRates?.minimumAmount) >
                Number(values.exchangeRates?.investmentTokenToRaise)
              ) {
                errors.exchangeRates =
                  'The deal minimum has to be equal or less than the amount you would like to raise'
              }
            }
          }
        }
      }
    }
  }

  return errors
}

export default validateCreateDirectDeal
