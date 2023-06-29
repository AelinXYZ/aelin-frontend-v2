export enum AddressesWhiteListAmountFormat {
  decimal = 'Decimal',
  uint256 = 'uint256',
}

export interface AddressWhiteListProps {
  address: string
  amount: string | null
  index: number
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
