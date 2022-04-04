import { Chains } from '@/src/constants/chains'

// Guard to check if var is Token type
export function isToken(token: any): token is Token {
  return (
    typeof token === 'object' &&
    'address' in token &&
    'chainId' in token &&
    'decimals' in token &&
    'logoURI' in token &&
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

// export const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
//
// export const ether = {
//   address: ETH_ADDRESS,
//   chainId: 1,
//   decimals: 18,
//   logoURI: '',
//   name: 'Ethereum',
//   symbol: 'ETH',
// }

export const TestnetTokens: { [chainId: number]: Token } = {
  [Chains.kovan]: {
    address: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
    chainId: Chains.kovan,
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png',
    name: 'DAI',
    symbol: 'DAI',
  },
  [Chains.goerli]: {
    address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    chainId: Chains.goerli,
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png',
    name: 'wETH',
    symbol: 'wETH',
  },
}
