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
