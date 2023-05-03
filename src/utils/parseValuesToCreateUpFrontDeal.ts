import { isAddress } from '@ethersproject/address'
import { BigNumberish } from '@ethersproject/bignumber'
import { HashZero, MaxUint256 } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'
import { wei } from '@synthetixio/wei'

import { NftType } from '../components/pools/whitelist/nft/nftWhiteListReducer'
import { NftCollectionRulesProps } from '../hooks/aelin/useAelinCreatePool'
import { AddressesWhiteListAmountFormat } from '@/src/components/pools/whitelist/addresses/types'
import { ZERO_BN } from '@/src/constants/misc'
import { BASE_DECIMALS } from '@/src/constants/misc'
import { Privacy } from '@/src/constants/pool'
import {
  CreateUpFrontDealStateComplete,
  CreateUpFrontDealValues,
} from '@/src/hooks/aelin/useAelinCreateUpFrontDeal'
import { getDuration } from '@/src/utils/date'

const getWhiteListAmount = (
  amount: number,
  whiteListAmountFormat: AddressesWhiteListAmountFormat,
  investmentTokenDecimals: number,
): number => {
  switch (whiteListAmountFormat) {
    case AddressesWhiteListAmountFormat.decimal:
      return parseUnits(amount.toString(), investmentTokenDecimals).toNumber()
    case AddressesWhiteListAmountFormat.uint256:
      return amount
  }
}

export const parseValuesToCreateUpFrontDeal = (
  createDealState: CreateUpFrontDealStateComplete,
  sponsor: string,
  merkleRoot?: string,
  ipfsHash?: string,
): CreateUpFrontDealValues => {
  const {
    dealAttributes,
    dealPrivacy,
    dealToken,
    exchangeRates,
    holderAddress,
    investmentToken,
    redemptionDeadline,
    sponsorFee,
    vestingSchedule,
    whiteListAmountFormat,
    whitelist,
  } = createDealState
  const now = new Date()

  const underlyingDealTokenTotal = wei(
    exchangeRates?.investmentTokenToRaise,
    dealToken.decimals,
  ).mul(wei(exchangeRates.exchangeRates, dealToken.decimals))

  const investmentPerDeal = wei(1, investmentToken.decimals).div(
    wei(exchangeRates.exchangeRates, investmentToken.decimals),
  )

  const purchaseRaiseMinimum = exchangeRates?.minimumAmount
    ? parseUnits(exchangeRates.minimumAmount.toString(), investmentToken.decimals)
    : ZERO_BN

  const redemptionDeadlineDuration = getDuration(
    now,
    redemptionDeadline.days,
    redemptionDeadline.hours,
    redemptionDeadline.minutes,
  )

  const vestingCliffDuration = getDuration(
    now,
    vestingSchedule.vestingCliff?.days as number,
    vestingSchedule.vestingCliff?.hours as number,
    vestingSchedule.vestingCliff?.minutes as number,
  )

  const vestingPeriodDuration = getDuration(
    now,
    vestingSchedule.vestingPeriod?.days as number,
    vestingSchedule.vestingPeriod?.hours as number,
    vestingSchedule.vestingPeriod?.minutes as number,
  )

  let dealAddresses: string[] = []
  let dealAddressesAmounts: BigNumberish[] = []
  let nftCollectionRules: NftCollectionRulesProps[] = []

  if (
    dealPrivacy === Privacy.PRIVATE &&
    !createDealState[NftType.erc1155] &&
    !createDealState[NftType.erc721]
  ) {
    if (!whiteListAmountFormat) {
      throw new Error('Format should be defined for a whitelist.')
    }

    const formattedWhiteList = whitelist.reduce((accum, curr) => {
      const { address, amount } = curr

      if (!isAddress(address)) return accum

      accum.push({
        address,
        amount: amount
          ? getWhiteListAmount(amount, whiteListAmountFormat, investmentToken.decimals)
          : MaxUint256.toNumber(),
      })

      return accum
    }, [] as { address: string; amount: BigNumberish }[])

    dealAddresses = formattedWhiteList.map(({ address }: { address: string }) => address)
    dealAddressesAmounts = formattedWhiteList.map(({ amount }: { amount: BigNumberish }) => amount)
  }

  if (dealPrivacy === Privacy.NFT && createDealState[NftType.erc721]) {
    nftCollectionRules = [...(createDealState[NftType.erc721] as NftCollectionRulesProps[])]
  }

  if (dealPrivacy === Privacy.NFT && createDealState[NftType.erc1155]) {
    nftCollectionRules = [...(createDealState[NftType.erc1155] as NftCollectionRulesProps[])]
  }

  if (nftCollectionRules.length) {
    nftCollectionRules = nftCollectionRules.map((collection) => ({
      ...collection,
      purchaseAmount: parseUnits(
        collection.purchaseAmount.toString(),
        createDealState.investmentToken?.decimals,
      ),
    }))
  }

  return [
    {
      name: dealAttributes.name,
      symbol: dealAttributes.symbol,
      purchaseToken: investmentToken.address,
      underlyingDealToken: dealToken.address,
      holder: holderAddress,
      sponsor,
      sponsorFee: sponsorFee ? parseUnits(sponsorFee?.toString(), BASE_DECIMALS) : ZERO_BN,
      merkleRoot: merkleRoot ?? HashZero,
      ipfsHash: ipfsHash ?? HashZero,
    },
    {
      underlyingDealTokenTotal: underlyingDealTokenTotal.toBN(),
      purchaseTokenPerDealToken: investmentPerDeal.toBN(),
      purchaseRaiseMinimum,
      purchaseDuration: redemptionDeadlineDuration,
      vestingPeriod: vestingPeriodDuration,
      vestingCliffPeriod: vestingCliffDuration,
      allowDeallocation: !exchangeRates.isCapped,
    },
    nftCollectionRules,
    {
      allowListAddresses: dealAddresses,
      allowListAmounts: dealAddressesAmounts,
    },
  ]
}
