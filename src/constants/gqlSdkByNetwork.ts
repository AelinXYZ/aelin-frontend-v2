import { GraphQLClient } from 'graphql-request'
import nullthrows from 'nullthrows'

import env from '@/config/env'
import { SdkWithHooks, getSdkWithHooks } from '@/graphql-schema'
import { Chains, ChainsValues } from '@/src/constants/chains'

export type AllSDK = Record<ChainsValues, SdkWithHooks>

// Set the queries SDK by chain id.
export const gqlGqlSdkByNetwork: AllSDK = {
  [Chains.mainnet]: getSdkWithHooks(
    new GraphQLClient(env.NEXT_PUBLIC_GRAPH_ENDPOINT_MAINNET as string),
  ),
  [Chains.goerli]: getSdkWithHooks(
    new GraphQLClient(env.NEXT_PUBLIC_GRAPH_ENDPOINT_GOERLI as string),
  ),
  [Chains.optimism]: getSdkWithHooks(
    new GraphQLClient(env.NEXT_PUBLIC_GRAPH_ENDPOINT_OPTIMISM as string),
  ),
  [Chains.arbitrum]: getSdkWithHooks(
    new GraphQLClient(env.NEXT_PUBLIC_GRAPH_ENDPOINT_ARBITRUM as string),
  ),
  [Chains.polygon]: getSdkWithHooks(
    new GraphQLClient(env.NEXT_PUBLIC_GRAPH_ENDPOINT_POLYGON as string),
  ),
}

export function getGqlSdkByNetwork(chainId: ChainsValues): ReturnType<typeof getSdkWithHooks> {
  const networkConfig = gqlGqlSdkByNetwork[chainId]
  return nullthrows(networkConfig, `No sdk for chain id: ${chainId}`)
}
