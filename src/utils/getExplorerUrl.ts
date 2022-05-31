import { ChainsValues, chainsConfig } from '../constants/config/chains'

export const getExplorerUrl = (hash: string, chainId: ChainsValues) => {
  const url = chainsConfig[chainId]?.blockExplorerUrls[0]
  const type = hash.length > 42 ? 'tx' : 'address'
  return `${url}${type}/${hash}`
}
