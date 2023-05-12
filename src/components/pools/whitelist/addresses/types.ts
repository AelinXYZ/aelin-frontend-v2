export enum AddressesWhiteListAmountFormat {
  decimal = 'Decimal',
  uint256 = 'uint256',
}

export interface AddressWhitelistProps {
  address: string
  amount: number | null
}

export enum AddressesWhiteListStep {
  format = 'format',
  addresses = 'addresses',
}

export interface AddressesWhiteListStepInfo {
  order: number
  title: string
  id: AddressesWhiteListStep
}

export enum AddressesWhiteListStatus {
  invalidAddress,
  duplicatedAddresses,
  invalidAmount,
  invalidDecimals,
  valid,
}
