import { BASE_DECIMALS } from './misc'
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
  [Chains.goerli]: [
    {
      name: 'Wrapped Ether',
      address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      symbol: 'WETH',
      decimals: BASE_DECIMALS,
      chainId: Chains.goerli,
    },
    {
      name: 'Uniswap',
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      symbol: 'UNI',
      decimals: BASE_DECIMALS,
      chainId: Chains.goerli,
    },
    {
      name: 'USDC',
      address: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
      symbol: 'USDC',
      decimals: 6,
      chainId: Chains.goerli,
    },
  ],
  [Chains.sepolia]: [
    {
      name: 'DEC6',
      address: '0x2e8a1986c635B526796C913c108B6C7B42D36BE5',
      symbol: 'DEC6',
      decimals: 6,
      chainId: Chains.sepolia,
    },
    {
      name: 'DEC8',
      address: '0xD7f7b6B95A8C73D397fbb431ea0EeB1E51f1DF75',
      symbol: 'DEC8',
      decimals: 8,
      chainId: Chains.sepolia,
    },

    {
      name: 'DEC18',
      address: '0xe8422dfAAf35E146C58d3cA7331Ab441Ed4091E8',
      symbol: 'DEC18',
      decimals: BASE_DECIMALS,
      chainId: Chains.sepolia,
    },
  ],
  [Chains.zkSyncTestnet]: [
    {
      name: 'wBTC',
      address: '0x0BfcE1D53451B4a8175DD94e6e029F7d8a701e9c',
      symbol: 'wBTC',
      decimals: BASE_DECIMALS,
      chainId: Chains.zkSyncTestnet,
    },
    {
      name: 'DAI',
      address: '0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b',
      symbol: 'DAI',
      decimals: 6,
      chainId: Chains.zkSyncTestnet,
    },
    {
      name: 'USDC',
      address: '0x0faF6df7054946141266420b43783387A78d82A9',
      symbol: 'USDC',
      decimals: 6,
      chainId: Chains.zkSyncTestnet,
    },
  ],
}
