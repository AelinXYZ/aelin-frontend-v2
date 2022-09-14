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
  isL2?: boolean
  iconUrls: string[]
  id: ChainsValues
  isProd: boolean
  name: string
  rpcUrl: string
  shortName: string
  tokenListUrl: string[]
  buyAelinUrl: string | undefined
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
    rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_TOKEN_PROVIDER}`,
    shortName: 'Mainnet',
    tokenListUrl: [
      'https://tokens.1inch.eth.limo',
      'https://gateway.ipfs.io/ipns/tokens.1inch.eth',
    ],
    buyAelinUrl:
      'https://app.uniswap.org/#/swap?outputCurrency=0xa9c125bf4c8bb26f299c00969532b66732b1f758&inputCurrency=ETH&chain=mainnet',
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
    rpcUrl: `https://eth-goerli.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_TOKEN_PROVIDER}`,
    shortName: 'Goerli',
    tokenListUrl: [
      'https://tokens.1inch.eth.limo',
      'https://gateway.ipfs.io/ipns/tokens.1inch.eth',
    ],
    buyAelinUrl: undefined,
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
    rpcUrl: `https://eth-kovan.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_TOKEN_PROVIDER}`,
    shortName: 'Kovan',
    tokenListUrl: [
      'https://tokens.1inch.eth.limo',
      'https://gateway.ipfs.io/ipns/tokens.1inch.eth',
    ],
    buyAelinUrl: undefined,
  },
  [Chains.optimism]: {
    id: Chains.optimism,
    name: 'Optimism',
    shortName: 'Optimism',
    chainId: Chains.optimism,
    chainIdHex: '0xa',
    rpcUrl: `https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_TOKEN_PROVIDER}`,
    blockExplorerUrls: ['https://optimistic.etherscan.io/'],
    iconUrls: [],
    isProd: true,
    icon: <Optimism />,
    tokenListUrl: ['https://static.optimism.io/optimism.tokenlist.json'],
    buyAelinUrl:
      'https://app.uniswap.org/#/swap?outputCurrency=0x61BAADcF22d2565B0F471b291C475db5555e0b76&inputCurrency=ETH&chain=optimism',
    isL2: true,
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
