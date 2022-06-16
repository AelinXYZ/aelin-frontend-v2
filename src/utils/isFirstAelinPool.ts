import { getAddress } from '@ethersproject/address'

import { FIRST_AELIN_POOL } from '@/src/constants/misc'

export const isFirstAelinPool = (address: string) =>
  getAddress(FIRST_AELIN_POOL) === getAddress(address)
