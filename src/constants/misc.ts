import { BigNumber } from '@ethersproject/bignumber'

// ETHERS/BIGNUMBER CONSTANTS
export const ZERO_BN = BigNumber.from(0)
export const ONE_BN = BigNumber.from(1)
export const TWO_BN = BigNumber.from(2)
export const MAX_BN = BigNumber.from(2).pow(256).sub(1)

export const FIRST_AELIN_POOL = '0x97fc4e0ce415ef922b08f4725a0fa197d7fdbec3'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const WAD_DECIMALS = 18
export const WAIT_BLOCKS = 8

export const DEFAULT_DECIMALS = 2
export const EXCHANGE_DECIMALS = 4
export const STAKING_DECIMALS = 4

export const GWEI_PRECISION = 9
export const GWEI_UNIT = 1000000000

export const DEBOUNCED_INPUT_TIME = 600
