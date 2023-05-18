import env from '@/config/env'
import { Chains, ChainsValues } from '@/src/constants/chains'

export const getTokenProvider = (chainId: ChainsValues) => {
  const tokenProvider = {
    [Chains.mainnet]: env.NEXT_PUBLIC_MAINNET_TOKEN_PROVIDER as string,
    [Chains.optimism]: env.NEXT_PUBLIC_OPTIMISM_TOKEN_PROVIDER as string,
    [Chains.arbitrum]: env.NEXT_PUBLIC_ARBITRUM_TOKEN_PROVIDER as string,
    [Chains.polygon]: env.NEXT_PUBLIC_POLYGON_TOKEN_PROVIDER as string,
    [Chains.zkSync]: '',
    [Chains.zkSyncTestnet]: '',
    [Chains.goerli]: env.NEXT_PUBLIC_GOERLI_TOKEN_PROVIDER as string,
    [Chains.sepolia]: env.NEXT_PUBLIC_SEPOLIA_TOKEN_PROVIDER as string,
  }

  if (!tokenProvider[chainId]) throw new Error('Token provider is missing')

  return tokenProvider[chainId]
}
