import nullthrows from 'nullthrows'

export enum ChainStringId {
  Mainnet = 'mainnet',
  Kovan = 'kovan',
  OptimismMainnet = 'mainnet-ovm',
  OptimismKovan = 'kovan-ovm',
  Local = 'local',
}

export type ChainConfig = {
  id: ChainStringId
  name: string
  shortName: string
  chainId: number
  chainIdHex: string
  rpcUrl: string
  blockExplorerUrls: string[]
  iconUrls: string[]
}

export enum ChainId {
  Mainnet = 1,
  Kovan = 42,
  OptimismMainnet = 10,
  OptimismKovan = 69,
  Local = 31337,
}

export const chains: Record<number, ChainConfig> = {
  [ChainId.Mainnet]: {
    id: ChainStringId.Mainnet,
    name: 'Mainnet',
    shortName: 'Mainnet',
    chainId: 1,
    chainIdHex: '0x1',
    rpcUrl: 'https://main-light.eth.linkpool.io',
    blockExplorerUrls: ['https://etherscan.io/'],
    iconUrls: [],
  },
  [ChainId.Kovan]: {
    id: ChainStringId.Kovan,
    name: 'Kovan',
    shortName: 'Kovan',
    chainId: 42,
    chainIdHex: '0x2a',
    rpcUrl: 'https://kovan.infura.io/v3/ecb81cbe2f03436cb39236e4160311fe',
    blockExplorerUrls: ['https://kovan.etherscan.io/'],
    iconUrls: [],
  },
  [ChainId.OptimismMainnet]: {
    id: ChainStringId.OptimismMainnet,
    name: 'Optimism',
    shortName: 'Optimism',
    chainId: 10,
    chainIdHex: '0xa',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorerUrls: ['https://optimistic.etherscan.io/'],
    iconUrls: [
      'https://optimism.io/images/metamask_icon.svg',
      'https://optimism.io/images/metamask_icon.png',
    ],
  },
  [ChainId.OptimismKovan]: {
    id: ChainStringId.OptimismKovan,
    name: 'Optimistic Kovan',
    shortName: 'Optimism',
    chainId: 69,
    chainIdHex: '0x45',
    rpcUrl: 'https://kovan.optimism.io',
    blockExplorerUrls: ['https://kovan-explorer.optimism.io/'],
    iconUrls: [
      'https://optimism.io/images/metamask_icon.svg',
      'https://optimism.io/images/metamask_icon.png',
    ],
  },
  [ChainId.Local]: {
    id: ChainStringId.Local,
    name: 'Local',
    shortName: 'Local',
    chainId: ChainId.Local,
    chainIdHex: '0x539',
    rpcUrl: 'http://0.0.0.0:8545',
    blockExplorerUrls: ['https://kovan-explorer.optimism.io/'],
    iconUrls: [
      'https://optimism.io/images/metamask_icon.svg',
      'https://optimism.io/images/metamask_icon.png',
    ],
  },
}

export function getNetworkConfig(chainId: ChainId): ChainConfig {
  const chainIdUNSAFE = chainId as any
  const networkConfig = chains[chainIdUNSAFE] as any
  return nullthrows(networkConfig, `No config for chain id: ${chainId}`)
}
