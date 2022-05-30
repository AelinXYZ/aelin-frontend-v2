import { GraphQLClient } from 'graphql-request'
import nullthrows from 'nullthrows'

import { SdkWithHooks, getSdkWithHooks } from '@/graphql-schema'
import { Chains, ChainsValues } from '@/src/constants/config/chains'
export type AllSDK = Record<ChainsValues, SdkWithHooks>

// Set the queries SDK by chain id.
export const gqlGqlSdkByNetwork: AllSDK = {
  [Chains.mainnet]: getSdkWithHooks(
    new GraphQLClient(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT_MAINNET || ''),
  ),
  [Chains.goerli]: getSdkWithHooks(
    new GraphQLClient(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT_GOERLI || ''),
  ),
  [Chains.kovan]: getSdkWithHooks(
    new GraphQLClient(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT_KOVAN || ''),
  ),
  [Chains.optimism]: getSdkWithHooks(
    new GraphQLClient(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT_OPTIMISM || ''),
  ),
}

export function getGqlSdkByNetwork(chainId: ChainsValues): ReturnType<typeof getSdkWithHooks> {
  const networkConfig = gqlGqlSdkByNetwork[chainId]
  return nullthrows(networkConfig, `No sdk for chain id: ${chainId}`)
}
