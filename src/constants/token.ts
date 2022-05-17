import { Chains } from '@/src/constants/chains'

// Guard to check if var is Token type
export function isToken(token: any): token is Token {
  return (
    typeof token === 'object' &&
    'address' in token &&
    'chainId' in token &&
    'decimals' in token &&
    'name' in token &&
    'symbol' in token
  )
}

export type Token = {
  address: string
  chainId: number
  decimals: number
  logoURI?: string
  name: string
  symbol: string
}
export type TokenListResponse = {
  keywords: string[]
  logoURI: string
  name: string
  tags: unknown
  timestamp: string
  tokens: Token[]
  version: { major: number; minor: number; patch: number }
}

export const TestnetTokens: { [chainId: number]: Token[] } = {
  [Chains.kovan]: [
    {
      chainId: Chains.kovan,
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      address: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
      decimals: 18,
    },
    {
      chainId: Chains.kovan,
      symbol: 'REP',
      name: 'Augur Reputation',
      address: '0x4e5cb5a0caca30d1ad27d8cd8200a907854fb518',
      decimals: 18,
    },
    {
      chainId: Chains.kovan,
      symbol: 'ETH',
      name: 'Ether',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
    },
    {
      chainId: Chains.kovan,
      symbol: 'WETH',
      name: 'Wrapped Ether',
      address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
      decimals: 18,
    },
    {
      chainId: Chains.kovan,
      symbol: 'ZRX',
      name: '0x Protocol Token',
      address: '0x2002d3812f58e35f0ea1ffbf80a75a38c32175fa',
      decimals: 18,
    },
    {
      chainId: Chains.kovan,
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x75b0622cec14130172eae9cf166b92e5c112faff',
      decimals: 6,
    },
    {
      chainId: Chains.kovan,
      symbol: 'BAT',
      name: 'Basic Attention Token',
      address: '0x9f8cfb61d3b2af62864408dd703f9c3beb55dff7',
      decimals: 18,
    },
    {
      chainId: Chains.kovan,
      symbol: 'MKR',
      name: 'Maker',
      address: '0xaaf64bfcc32d0f15873a02163e7e500671a4ffcd',
      decimals: 18,
    },
    {
      chainId: Chains.kovan,
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      address: '0xa0a5ad2296b38bd3e3eb59aaeaf1589e8d9a29a9',
      decimals: 8,
    },
    {
      chainId: Chains.kovan,
      symbol: 'KNC',
      name: 'Kyber Network Crystal',
      address: '0xad67cb4d63c9da94aca37fdf2761aadf780ff4a2',
      decimals: 18,
    },
    {
      symbol: 'SAI',
      name: 'Sai Stablecoin v1.0',
      address: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
      decimals: 18,
      chainId: Chains.kovan,
    },
    {
      symbol: 'cREP',
      name: 'Compound Augur',
      address: '0xfd874be7e6733bdc6dca9c7cdd97c225ec235d39',
      decimals: 8,
      chainId: Chains.kovan,
    },
    {
      chainId: Chains.kovan,
      symbol: 'cZRX',
      name: 'Compound 0x',
      address: '0xc014dc10a57ac78350c5fddb26bb66f1cb0960a0',
      decimals: 8,
    },
    {
      symbol: 'ZWETH',
      name: 'Custom Kovan Wrapped Ether',
      address: '0x1FcAf05ABa8c7062D6F08E25c77Bf3746fCe5433',
      decimals: 18,
      chainId: Chains.kovan,
    },
    {
      symbol: 'ZUSDC',
      name: 'Custom Kovan USD Coin',
      address: '0x5a719Cf3E02c17c876F6d294aDb5CB7C6eB47e2F',
      decimals: 6,
      chainId: Chains.kovan,
    },
  ],
  [Chains.goerli]: [
    {
      name: 'Wrapped Ether',
      address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      symbol: 'WETH',
      decimals: 18,
      chainId: Chains.goerli,
    },
    {
      name: 'Uniswap',
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      symbol: 'UNI',
      decimals: 18,
      chainId: Chains.goerli,
    },
  ],
}
