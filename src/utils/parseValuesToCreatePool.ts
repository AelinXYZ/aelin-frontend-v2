import { BigNumberish } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'

import { NftType } from '../components/pools/whitelist/nft/nftWhiteListReducer'
import { NftCollectionRulesProps } from '../hooks/aelin/useAelinCreatePool'
import { ZERO_BN } from '@/src/constants/misc'
import { BASE_DECIMALS } from '@/src/constants/misc'
import { Privacy } from '@/src/constants/pool'
import { CreatePoolStateComplete, CreatePoolValues } from '@/src/hooks/aelin/useAelinCreatePool'
import { getDuration } from '@/src/utils/date'

enum AddressesWhiteListAmountFormat {
  decimal = 'Decimal',
  uint256 = 'uint256',
}

const getWhiteListAmount = (
  amount: number,
  whiteListAmountFormat: AddressesWhiteListAmountFormat,
  investmentTokenDecimals: number,
): string => {
  switch (whiteListAmountFormat) {
    case AddressesWhiteListAmountFormat.decimal:
      return parseUnits(amount.toString(), investmentTokenDecimals).toString()
    case AddressesWhiteListAmountFormat.uint256:
      return String(amount)
  }
}

export const parseValuesToCreatePool = (
  createPoolState: CreatePoolStateComplete,
): CreatePoolValues => {
  const {
    dealDeadline,
    investmentDeadLine,
    investmentToken,
    poolCap,
    poolName,
    poolPrivacy,
    poolSymbol,
    sponsorFee,
    whiteListAmountFormat,
    whitelist,
  } = createPoolState
  const now = new Date()
  const investmentDeadLineDuration = getDuration(
    now,
    investmentDeadLine.days,
    investmentDeadLine.hours,
    investmentDeadLine.minutes,
  )

  const dealDeadLineDuration = getDuration(
    now,
    dealDeadline.days,
    dealDeadline.hours,
    dealDeadline.minutes,
  )

  let poolAddresses: string[] = []
  let poolAddressesAmounts: BigNumberish[] = []
  let nftCollectionRules: NftCollectionRulesProps[] = []

  if (
    poolPrivacy === Privacy.PRIVATE &&
    !createPoolState[NftType.erc1155] &&
    !createPoolState[NftType.erc721]
  ) {
    if (!whiteListAmountFormat) {
      throw new Error('Format should be defined for a whitelist.')
    }

    const formattedWhiteList = whitelist.reduce((accum, curr) => {
      const { address, amount } = curr

      if (!address.length) return accum

      accum.push({
        address,
        amount: amount
          ? getWhiteListAmount(amount, whiteListAmountFormat, investmentToken.decimals)
          : MaxUint256.toString(),
      })

      return accum
    }, [] as { address: string; amount: BigNumberish }[])

    poolAddresses = formattedWhiteList.map(({ address }: { address: string }) => address)
    poolAddressesAmounts = formattedWhiteList.map(({ amount }: { amount: BigNumberish }) => amount)
  }

  if (poolPrivacy === Privacy.NFT && createPoolState[NftType.erc721]) {
    nftCollectionRules = [...(createPoolState[NftType.erc721] as NftCollectionRulesProps[])]
  }

  if (poolPrivacy === Privacy.NFT && createPoolState[NftType.erc1155]) {
    nftCollectionRules = [...(createPoolState[NftType.erc1155] as NftCollectionRulesProps[])]
  }

  if (nftCollectionRules.length) {
    nftCollectionRules = nftCollectionRules.map((collection) => ({
      ...collection,
      purchaseAmount: parseUnits(
        collection.purchaseAmount.toString(),
        createPoolState.investmentToken?.decimals ?? BASE_DECIMALS,
      ),
    }))
  }

  return {
    name: poolName,
    symbol: poolSymbol,
    purchaseTokenCap: poolCap ? parseUnits(poolCap.toString(), investmentToken?.decimals) : ZERO_BN,
    purchaseToken: investmentToken.address,
    sponsorFee: sponsorFee ? parseUnits(sponsorFee?.toString(), BASE_DECIMALS) : ZERO_BN,
    purchaseDuration: investmentDeadLineDuration,
    duration: dealDeadLineDuration,
    allowListAddresses: poolAddresses,
    allowListAmounts: poolAddressesAmounts,
    nftCollectionRules: nftCollectionRules,
  }
}
