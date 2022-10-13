import { BigNumber } from '@ethersproject/bignumber'
const mergeArrayKeyValuePairs = (addresses: string[], amounts: BigNumber[]) => {
  return addresses.reduce((prev: any, curr: any, index: number) => {
    return { ...prev, [curr]: amounts[index].toString() }
  }, {})
}

export { mergeArrayKeyValuePairs }
