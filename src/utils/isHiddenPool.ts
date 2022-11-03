import { getAddress } from '@ethersproject/address'

import { HIDDEN_POOLS } from '@/src/constants/misc'

const PREFIX_TEST = ['TEST_', '_TEST', 'TEST-', '-TEST', 'TEST POOL']

export const isHiddenPool = (address: string) =>
  HIDDEN_POOLS.some((poolAddress) => getAddress(poolAddress) === getAddress(address))

export const isTestPool = (poolName: string) =>
  PREFIX_TEST.some((prefix) => poolName.toLowerCase().includes(prefix.toLowerCase()))
