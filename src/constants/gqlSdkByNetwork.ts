import { GraphQLClient } from 'graphql-request'
import nullthrows from 'nullthrows'

import { getSdkWithHooks } from '@/graphql-schema'
import { Chains, ChainsValues } from '@/src/constants/chains'
import {
  GRAPH_URL_GOERLI,
  GRAPH_URL_KOVAN,
  GRAPH_URL_MAINNET,
  GRAPH_URL_OPTIMISM,
} from '@/src/constants/endpoints'

// Set the queries SDK by chain id.
export const gqlGqlSdkByNetwork: Record<ChainsValues, ReturnType<typeof getSdkWithHooks>> = {
  [Chains.mainnet]: getSdkWithHooks(new GraphQLClient(GRAPH_URL_MAINNET)),
  [Chains.goerli]: getSdkWithHooks(new GraphQLClient(GRAPH_URL_GOERLI)),
  [Chains.kovan]: getSdkWithHooks(new GraphQLClient(GRAPH_URL_KOVAN)),
  [Chains.optimism]: getSdkWithHooks(new GraphQLClient(GRAPH_URL_OPTIMISM)),
}

export function getGqlSdkByNetwork(chainId: ChainsValues): ReturnType<typeof getSdkWithHooks> {
  const networkConfig = gqlGqlSdkByNetwork[chainId]
  return nullthrows(networkConfig, `No sdk for chain id: ${chainId}`)
}
