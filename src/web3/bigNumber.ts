import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import Wei from '@synthetixio/wei'

import { DEFAULT_DECIMALS } from '@/src/constants/misc'

export function formatToken(
  value: BigNumberish,
  valueScale = 18,
  decimals = DEFAULT_DECIMALS,
): string | undefined {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return undefined
  }

  const numberInWei = new Wei(BigNumber.from(value), valueScale)

  return Intl.NumberFormat('en', {
    maximumFractionDigits: decimals,
  }).format(numberInWei.toNumber())
}
