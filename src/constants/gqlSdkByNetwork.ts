import { GraphQLClient } from 'graphql-request'
import nullthrows from 'nullthrows'

import { SdkWithHooks, getSdkWithHooks } from '@/graphql-schema'
import { Chains, ChainsValues } from '@/src/constants/chains'
import {
  GRAPH_URL_ARBITRUM,
  GRAPH_URL_GOERLI,
  GRAPH_URL_GOERLI_ROLLUP,
  GRAPH_URL_KOVAN,
  GRAPH_URL_MAINNET,
  GRAPH_URL_OPTIMISM,
} from '@/src/constants/endpoints'

export type AllSDK = Record<ChainsValues, SdkWithHooks>

// Set the queries SDK by chain id.
export const gqlGqlSdkByNetwork: AllSDK = {
  [Chains.mainnet]: getSdkWithHooks(new GraphQLClient(GRAPH_URL_MAINNET)),
  [Chains.goerli]: getSdkWithHooks(new GraphQLClient(GRAPH_URL_GOERLI)),
  [Chains.kovan]: getSdkWithHooks(new GraphQLClient(GRAPH_URL_KOVAN)),
  [Chains.optimism]: getSdkWithHooks(new GraphQLClient(GRAPH_URL_OPTIMISM)),
  [Chains.arbitrum]: getSdkWithHooks(new GraphQLClient(GRAPH_URL_ARBITRUM)),
  [Chains.goerliRollup]: getSdkWithHooks(new GraphQLClient(GRAPH_URL_GOERLI_ROLLUP)),
}

export function getGqlSdkByNetwork(chainId: ChainsValues): ReturnType<typeof getSdkWithHooks> {
  const networkConfig = gqlGqlSdkByNetwork[chainId]
  return nullthrows(networkConfig, `No sdk for chain id: ${chainId}`)
}
