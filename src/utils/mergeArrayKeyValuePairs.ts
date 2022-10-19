import { BigNumberish } from '@ethersproject/bignumber'

const mergeArrayKeyValuePairs = (addresses: string[], amounts: BigNumberish[]) => {
  return addresses.reduce((prev: any, curr: any, index: number) => {
    return { ...prev, [curr]: amounts[index] }
  }, {})
}

export { mergeArrayKeyValuePairs }
