import BigNumber from 'bignumber.js'

import { ZERO_BN_JS } from '@/src/constants/misc'

BigNumber.prototype.scaleBy = function (decimals: any = 0): any {
  return this.multipliedBy(10 ** decimals)
}

BigNumber.prototype.unscaleBy = function (decimals: any = 0): any {
  return this.dividedBy(10 ** decimals)
}

BigNumber.from = (value: any): any => {
  if (value === undefined || value === null) {
    return undefined
  }

  const bnValue = new BigNumber(value)

  if (bnValue.isNaN()) {
    return undefined
  }

  return bnValue
}

BigNumber.sumEach = <T = any>(
  items: T[],
  predicate: (item: T) => BigNumber | undefined,
): BigNumber | undefined => {
  let sum = ZERO_BN_JS

  for (const item of items) {
    const val = predicate?.(item)

    if (!val || val.isNaN()) {
      return undefined
    }

    sum = sum.plus(val)
  }

  return sum
}
