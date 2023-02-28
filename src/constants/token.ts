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
      address: (process.env.NEXT_PUBLIC_ANVIL as string)
        ? (process.env.NEXT_PUBLIC_WETH as string)
        : '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      symbol: 'WETH',
      decimals: BASE_DECIMALS,
      chainId: Chains.goerli,
    },
    {
      name: 'Uniswap',
      address: (process.env.NEXT_PUBLIC_ANVIL as string)
        ? (process.env.NEXT_PUBLIC_UNI as string)
        : '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      symbol: 'UNI',
      decimals: BASE_DECIMALS,
      chainId: Chains.goerli,
    },
    {
      name: 'USDC',
      address: (process.env.NEXT_PUBLIC_ANVIL as string)
        ? (process.env.NEXT_PUBLIC_USDC as string)
        : '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
      symbol: 'USDC',
      decimals: 6,
      chainId: Chains.goerli,
    },
  ],
}
