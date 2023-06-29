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
  gasLimit: Wei
  l1Fee?: Wei
} | null

export type GasPrices = {
  l1: GasPrice<Eip1559GasPrice | number>
  l2?: GasPrice<Eip1559GasPrice | number>
}

export type GasPrice<T> = {
  aggressive: T
  market: T
  low: T
}

export type Eip1559GasPrice = {
  maxFeePerGas: Wei
  maxPriorityFeePerGas: Wei
}
export type GasSpeed = keyof GasPrice<number>
export type Rates = Record<string, Wei>

export type UseTransactionReturn<Params> = {
  estimate: (params?: Params) => Promise<GasLimitEstimate | null>
  execute: (
    params?: Params | undefined,
    options?: Overrides | undefined,
  ) => Promise<ContractReceipt | null>
}
