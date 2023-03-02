import nullthrows from 'nullthrows'

import { BASE_DECIMALS } from './misc'
import env from '@/config/env'
import { Arbitrum } from '@/src/components/assets/Arbitrum'
import { Mainnet } from '@/src/components/assets/Mainnet'
import { Optimism } from '@/src/components/assets/Optimism'
import { Polygon } from '@/src/components/assets/Polygon'
import { NetworkPlaceholder } from '@/src/components/common/NetworkPlaceholder'
import isDev from '@/src/utils/isDev'
import { ObjectValues } from '@/types/utils'

export const Chains = {
  mainnet: 1,
  goerli: 5,
  optimism: 10,
  polygon: 137,
  arbitrum: 42161,
} as const

export type ChainsValues = ObjectValues<typeof Chains>
export type ChainsKeys = keyof typeof Chains
export type ChainsValuesArray = Array<ChainsValues>

export function getKeyChainByValue(chainId: ChainsValues) {
  return Object.keys(Chains).find((key) => Chains[key as ChainsKeys] === chainId)
}

const toHex = (chainId: number) => {
  return '0x' + chainId.toString(16)
}

export type ChainConfig = {
  blockExplorerUrls: string[]
  chainId: ChainsValues
  chainIdHex: string
  icon?: React.ReactNode
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  isL2?: boolean
  iconUrls: string[]
  isProd: boolean
  name: string
  rpcUrl: string
  defaultRpcUrl: string
  shortName: string
  tokenListUrl: string[]
  buyAelinUrl: string | undefined
}

export const chainsConfig: Record<ChainsValues, ChainConfig> = {
  [Chains.mainnet]: {
    blockExplorerUrls: ['https://etherscan.io/'],
    chainId: Chains.mainnet,
    chainIdHex: toHex(Chains.mainnet),
    icon: <Mainnet />,
    iconUrls: [],
    isProd: true,
    name: 'Ethereum Mainnet',
    rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${env.NEXT_PUBLIC_MAINNET_TOKEN_PROVIDER}`,
    defaultRpcUrl: 'https://rpc.ankr.com/eth',
    shortName: 'Mainnet',
    tokenListUrl: [
      'https://tokens.1inch.eth.limo',
      'https://gateway.ipfs.io/ipns/tokens.1inch.eth',
    ],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: BASE_DECIMALS,
    },
    buyAelinUrl:
      'https://app.uniswap.org/#/swap?outputCurrency=0xa9c125bf4c8bb26f299c00969532b66732b1f758&inputCurrency=ETH&chain=mainnet',
  },
  [Chains.goerli]: {
    blockExplorerUrls: ['https://goerli.etherscan.io/'],
    chainId: Chains.goerli,
    chainIdHex: toHex(Chains.goerli),
    icon: <NetworkPlaceholder name="G" />,
    iconUrls: [],
    isProd: false,
    name: 'Görli Testnet',
    rpcUrl:
      (process.env.NEXT_PUBLIC_ANVIL as string) ??
      `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_GOERLI_TOKEN_PROVIDER}`,
    defaultRpcUrl:
      (process.env.NEXT_PUBLIC_ANVIL as string) ??
      `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_GOERLI_TOKEN_PROVIDER}`,
    shortName: 'Goerli',
    tokenListUrl: [
      'https://tokens.1inch.eth.limo',
      'https://gateway.ipfs.io/ipns/tokens.1inch.eth',
    ],
    nativeCurrency: {
      name: 'Goerli ETH',
      symbol: 'GoerliETH',
      decimals: BASE_DECIMALS,
    },
    buyAelinUrl: undefined,
  },
  [Chains.optimism]: {
    name: 'Optimism Ethereum',
    shortName: 'Optimism',
    chainId: Chains.optimism,
    chainIdHex: toHex(Chains.optimism),
    rpcUrl: `https://opt-mainnet.g.alchemy.com/v2/${env.NEXT_PUBLIC_OPTIMISM_TOKEN_PROVIDER}`,
    defaultRpcUrl: 'https://mainnet.optimism.io',
    blockExplorerUrls: ['https://optimistic.etherscan.io/'],
    iconUrls: [],
    isProd: true,
    icon: <Optimism />,
    tokenListUrl: ['https://static.optimism.io/optimism.tokenlist.json'],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: BASE_DECIMALS,
    },
    buyAelinUrl:
      'https://app.uniswap.org/#/swap?outputCurrency=0x61BAADcF22d2565B0F471b291C475db5555e0b76&inputCurrency=ETH&chain=optimism',
    isL2: true,
  },
  [Chains.arbitrum]: {
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    chainId: Chains.arbitrum,
    chainIdHex: toHex(Chains.arbitrum),
    rpcUrl: `https://arb-mainnet.g.alchemy.com/v2/${env.NEXT_PUBLIC_ARBITRUM_TOKEN_PROVIDER}`,
    defaultRpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorerUrls: ['https://arbiscan.io/'],
    iconUrls: [],
    isProd: true,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: BASE_DECIMALS,
    },
    icon: <Arbitrum />,
    tokenListUrl: ['https://tokens.uniswap.org/'],
    buyAelinUrl: undefined,
    isL2: true,
  },
  [Chains.polygon]: {
    name: 'Polygon Mainnet',
    shortName: 'Polygon',
    chainId: Chains.polygon,
    chainIdHex: toHex(Chains.polygon),
    rpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/${env.NEXT_PUBLIC_POLYGON_TOKEN_PROVIDER}`,
    defaultRpcUrl: 'https://polygon-rpc.com/',
    blockExplorerUrls: ['https://polygonscan.com/'],
    iconUrls: [],
    isProd: true,
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: BASE_DECIMALS,
    },
    icon: <Polygon />,
    tokenListUrl: ['https://tokens.uniswap.org/'],
    buyAelinUrl: undefined,
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
