import nullthrows from 'nullthrows'

import { Mainnet } from '@/src/components/assets/Mainnet'
import { Optimism } from '@/src/components/assets/Optimism'
import { NetworkPlaceholder } from '@/src/components/common/NetworkPlaceholder'
import isDev from '@/src/utils/isDev'
import { ObjectValues } from '@/types/utils'

export const Chains = {
  mainnet: 1,
  goerli: 5,
  kovan: 42,
  optimism: 10,
} as const

export type ChainsValues = ObjectValues<typeof Chains>
export type ChainsKeys = keyof typeof Chains
export type ChainsValuesArray = Array<ChainsValues>

export function getKeyChainByValue(chainId: ChainsValues) {
  return Object.keys(Chains).find((key) => Chains[key as ChainsKeys] === chainId)
}

export type ChainConfig = {
  blockExplorerUrls: string[]
  chainId: ChainsValues
  chainIdHex: string
  icon?: React.ReactNode
  iconUrls: string[]
  id: ChainsValues
  isProd: boolean
  name: string
  rpcUrl: string
  shortName: string
  tokenListUrl: string
}

export const chainsConfig: Record<ChainsValues, ChainConfig> = {
  [Chains.mainnet]: {
    blockExplorerUrls: ['https://etherscan.io/'],
    chainId: Chains.mainnet,
    chainIdHex: '0x1',
    icon: <Mainnet />,
    iconUrls: [],
    id: Chains.mainnet,
    isProd: true,
    name: 'Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    shortName: 'Mainnet',
    tokenListUrl: 'https://gateway.ipfs.io/ipns/tokens.1inch.eth',
  },
  [Chains.goerli]: {
    blockExplorerUrls: ['https://goerli.etherscan.io/'],
    chainId: Chains.goerli,
    chainIdHex: '0x5',
    icon: <NetworkPlaceholder name="G" />,
    iconUrls: [],
    id: Chains.goerli,
    isProd: false,
    name: 'Görli Testnet',
    rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    shortName: 'Goerli',
    tokenListUrl: 'https://gateway.ipfs.io/ipns/tokens.1inch.eth',
  },
  [Chains.kovan]: {
    blockExplorerUrls: ['https://kovan.etherscan.io/'],
    chainId: Chains.kovan,
    chainIdHex: '0x2a',
    icon: <NetworkPlaceholder name="K" />,
    iconUrls: [],
    id: Chains.kovan,
    isProd: false,
    name: 'Kovan',
    rpcUrl: 'https://eth-kovan.alchemyapi.io/v2/4FmY4vIgkyIWj8usKirqN_zT83xsHjlE',
    shortName: 'Kovan',
    tokenListUrl: 'https://gateway.ipfs.io/ipns/tokens.1inch.eth',
  },
  [Chains.optimism]: {
    id: Chains.optimism,
    name: 'Optimism',
    shortName: 'Optimism',
    chainId: Chains.optimism,
    chainIdHex: '0xa',
    //rpcUrl: 'https://mainnet.optimism.io/',
    rpcUrl: 'https://opt-mainnet.g.alchemy.com/v2/CVCAPo-jxyRYey2btuEpguf_pGSZ3Llj/',
    blockExplorerUrls: ['https://optimistic.etherscan.io/'],
    iconUrls: [],
    isProd: true,
    icon: <Optimism />,
    tokenListUrl: 'https://static.optimism.io/optimism.tokenlist.json',
  },
}

// Return chains by environment as array
export function getChainsByEnvironmentArray() {
  return Object.values(chainsConfig).filter(({ isProd }) => isProd !== isDev)
}

export function getNetworkConfig(chainId: ChainsValues): ChainConfig {
  const networkConfig = chainsConfig[chainId]
  return nullthrows(networkConfig, `No config for chain id: ${chainId}`)
}
