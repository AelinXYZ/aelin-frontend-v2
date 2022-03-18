import nullthrows from 'nullthrows'

import { Mainnet } from '@/src/components/assets/Mainnet'
import { Optimism } from '@/src/components/assets/Optimism'
import { NetworkPlaceholder } from '@/src/components/common/NetworkPlaceholder'
import { ObjectValues } from '@/types/utils'

export const Chains = {
  mainnet: 1,
  goerli: 5,
  kovan: 42,
  optimism: 10,
} as const

export type ChainsValues = ObjectValues<typeof Chains>
export type ChainsKeys = keyof typeof Chains

export function getKeyChainByValue(chainId: number) {
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
    rpcUrl: 'https://main-light.eth.linkpool.io',
    shortName: 'Mainnet',
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
    rpcUrl: 'https://kovan.infura.io/v3/ecb81cbe2f03436cb39236e4160311fe',
    shortName: 'Kovan',
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
  },
}

export function getNetworkConfig(chainId: ChainsValues): ChainConfig {
  const networkConfig = chainsConfig[chainId]
  return nullthrows(networkConfig, `No config for chain id: ${chainId}`)
}
