import Wei from '@synthetixio/wei'

export type ObjectValues<T> = T[keyof T]

export type Extends<T, U extends T> = U
export type Maybe<T> = T | null
export type RequiredNonNull<T> = { [P in keyof T]-?: NonNullable<T[P]> }
export type SwrResponse<T> = { data: T[]; loading: boolean; error: any }

// extract type from array
export type Unpacked<T> = T extends (infer U)[] ? U : T

export type GasLimitEstimate = Wei | null

export type GasPrices = {
  fastest: number
  fast: number
  average: number
}

export type GasSpeed = keyof GasPrices
export type Rates = Record<string, Wei>
