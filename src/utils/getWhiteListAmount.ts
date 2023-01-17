import { BigNumberish } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'

import { AddressesWhiteListAmountFormat } from '../components/pools/whitelist/addresses/AddressesWhiteList'

export const getWhiteListAmount = (
  amount: string,
  whiteListAmountFormat: AddressesWhiteListAmountFormat,
  investmentTokenDecimals: number,
): BigNumberish => {
  switch (whiteListAmountFormat) {
    case AddressesWhiteListAmountFormat.decimal:
      return parseUnits(amount, investmentTokenDecimals).toString()
    case AddressesWhiteListAmountFormat.uint256:
      return amount
  }
}
