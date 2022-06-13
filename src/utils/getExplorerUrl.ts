import { isAddress } from '@ethersproject/address'

import { ChainsValues, chainsConfig } from '../constants/chains'

export const getExplorerUrl = (hash: string, chainId: ChainsValues) => {
  const url = chainsConfig[chainId]?.blockExplorerUrls[0]
  const type = isAddress(hash) ? 'address' : 'tx'
  return `${url}${type}/${hash}`
}
