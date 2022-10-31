import { BigNumber } from '@ethersproject/bignumber'
import { HashZero } from '@ethersproject/constants'

// ETHERS/BIGNUMBER CONSTANTS
export const ZERO_BN = BigNumber.from(0)
export const ONE_BN = BigNumber.from(1)
export const TWO_BN = BigNumber.from(2)
export const MAX_BN = BigNumber.from(2).pow(256).sub(1)

export const HIDDEN_POOLS = [
  '0x97fc4e0ce415ef922b08f4725a0fa197d7fdbec3',
  '0x1beb0c0af60c037aa5b7e48b2e5cd952fe512390',
]

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const WAD_DECIMALS = 18
export const WAIT_BLOCKS = 8

export const EXCHANGE_DECIMALS = 4
export const STAKING_DECIMALS = 4
export const BASE_DECIMALS = 18
export const DISPLAY_DECIMALS = 2

export const GWEI_PRECISION = 9
export const GWEI_UNIT = 1000000000

export const DEBOUNCED_INPUT_TIME = 600

export const OPENSEA_BASE_URL = 'https://opensea.io/'
export const QUIXOTIC_BASE_URL = 'https://qx.app/'
export const STRATOS_BASE_URL = 'https://stratosnft.io/'
export const AELIN_APP_DEV_URL = 'https://testnet.app.aelin.xyz'

export const POOL_NAME_MAX_LENGTH = 30

export const MAX_PRIVATE_ROWS = 20

export const MERKLE_TREE_DATA_EMPTY = {
  index: 0,
  account: ZERO_ADDRESS,
  amount: ZERO_BN,
  merkleProof: [HashZero],
}
