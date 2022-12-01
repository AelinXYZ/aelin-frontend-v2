import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import Wei from '@synthetixio/wei'

import {
  BASE_DECIMALS,
  DISPLAY_DECIMALS,
  SMALL_NUMBER_DISPLAY_DECIMALS,
} from '@/src/constants/misc'

export function formatToken(
  value: BigNumberish,
  valueScale = BASE_DECIMALS,
  decimals = DISPLAY_DECIMALS,
): string | undefined {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return undefined
  }

  const valueInWei = new Wei(BigNumber.from(value), valueScale)
  const valueAsNumber = valueInWei.toNumber()

  return Intl.NumberFormat('en', {
    maximumFractionDigits:
      valueAsNumber < 1 && decimals < SMALL_NUMBER_DISPLAY_DECIMALS
        ? SMALL_NUMBER_DISPLAY_DECIMALS
        : decimals,
  }).format(valueAsNumber)
}
