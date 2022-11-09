import { Chains, ChainsValues } from '@/src/constants/chains'

export const getTokenProvider = (chainId: ChainsValues) => {
  const tokenProvider = {
    [Chains.mainnet]: process.env.NEXT_PUBLIC_MAINNET_TOKEN_PROVIDER,
    [Chains.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_TOKEN_PROVIDER,
    [Chains.arbitrum]: process.env.NEXT_PUBLIC_ARBITRUM_TOKEN_PROVIDER,
    [Chains.goerli]: process.env.NEXT_PUBLIC_GOERLI_TOKEN_PROVIDER,
  }

  if (!tokenProvider[chainId]) throw new Error('Token provider is missing')

  return tokenProvider[chainId]
}
