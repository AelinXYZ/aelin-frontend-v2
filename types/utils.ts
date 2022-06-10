import { BigNumber } from '@ethersproject/bignumber'
import { ContractReceipt, Overrides } from '@ethersproject/contracts'
import Wei from '@synthetixio/wei'

export type ObjectValues<T> = T[keyof T]

export type Extends<T, U extends T> = U
export type Maybe<T> = T | null
export type RequiredNonNull<T> = { [P in keyof T]-?: NonNullable<T[P]> }
export type SwrResponse<T> = { data: T[]; loading: boolean; error: any }

// extract type from array
export type Unpacked<T> = T extends (infer U)[] ? U : T

export type DetailedNumber = {
  raw: BigNumber
  formatted: string | undefined
}
export type GasLimitEstimate = {
  l1: Wei
  l2?: Wei
} | null

export type GasPrices = {
  l1: GasPrice
  l2?: GasPrice
}

export type GasPrice = {
  fastest: number
  fast: number
  average: number
}

export type GasSpeed = keyof GasPrice
export type Rates = Record<string, Wei>

export type UseTransactionReturn<Params> = {
  estimate: (params?: Params) => Promise<{
    l1Gas: BigNumber
    l2Gas: BigNumber
  } | null>
  execute: (
    params?: Params | undefined,
    options?: Overrides | undefined,
  ) => Promise<ContractReceipt | null>
}
