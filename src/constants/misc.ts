import { BigNumber } from '@ethersproject/bignumber'

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
export const SUBGRAPH_API = process.env.NEXT_PUBLIC_REACT_APP_SUBGRAPH_API || ''
export const WAD_DECIMALS = 18
export const WAIT_BLOCKS = 8

export const DEFAULT_DECIMALS = 2
