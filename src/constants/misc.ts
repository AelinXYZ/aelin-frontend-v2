import { BigNumber } from '@ethersproject/bignumber'
import Wei from '@synthetixio/wei'

// Be careful when/where use these constants!

// BIGNUMBER JS CONSTANTS
// export const ZERO_BN_JS = new BigNumberJS(0)
// export const ONE_BN_JS = new BigNumberJS(1)
// export const TWO_BN_JS = new BigNumberJS(2)
// export const MAX_UINT_256_BN_JS = TWO_BN_JS.pow(256).minus(1)

// ETHERS/BIGNUMBER CONSTANTS
export const ZERO_BN = BigNumber.from(0)
export const ONE_BN = BigNumber.from(1)
export const TWO_BN = BigNumber.from(2)
export const MAX_BN = BigNumber.from(2).pow(256).sub(1)
// export const MAX_UINT_256 = TWO_BN_JS.pow(256).minus(1)

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const WAD_DECIMALS = 18
export const WAIT_BLOCKS = 8

export const DEFAULT_DECIMALS = 2
export const EXCHANGE_DECIMALS = 4

export const GWEI_PRECISION = 9
export const GWEI_UNIT = 1000000000

export const DEBOUNCED_INPUT_TIME = 500
