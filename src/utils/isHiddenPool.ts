import { getAddress } from '@ethersproject/address'

import { HIDDEN_POOLS } from '@/src/constants/misc'

export const isHiddenPool = (address: string) =>
  HIDDEN_POOLS.some((poolAddress) => getAddress(poolAddress) === getAddress(address))
