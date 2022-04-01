import { Provider } from '@ethersproject/providers'

import { Chains } from '@/src/constants/chains'
import { getERC20Data } from '@/src/utils/getERC20Data'

export type Token = {
  address: string
  chainId: number
  decimals: number
  logoURI: string
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

type ValidateErc20AddressReturn =
  | { result: 'success'; token: Token }
  | { result: 'failure'; errorMessage: string }

export const validateErc20Address = async (
  address: string,
  provider: Provider | undefined,
): Promise<ValidateErc20AddressReturn> => {
  if (!provider) return { result: 'failure', errorMessage: 'Wallet not connected' }

  const { decimals, name, symbol, totalSupply } = await getERC20Data({ address, provider })

  if (
    typeof name === 'string' &&
    typeof symbol === 'string' &&
    typeof decimals === 'number' &&
    totalSupply !== undefined
  ) {
    const token: Token = {
      address,
      symbol,
      name,
      decimals,
      chainId: 1,
      logoURI: '',
    }

    return {
      result: 'success',
      token,
    }
  }

  return { result: 'failure', errorMessage: 'Not a valid ERC20 address' }
}
