import { GraphQLClient } from 'graphql-request'
import nullthrows from 'nullthrows'

import { getSdkWithHooks } from '@/graphql-schema'
import { Chains, ChainsValues } from '@/src/constants/chains'
import {
  GRAPH_URL_GOERLI,
  GRAPH_URL_KOVAN,
  GRAPH_URL_MAINNET,
  GRAPH_URL_OPTMISM,
} from '@/src/constants/endpoints'

// Set the queries SDK by chain id.
export const gqlSdkByNetwork: Record<ChainsValues, ReturnType<typeof getSdkWithHooks>> = {
  [Chains.mainnet]: getSdkWithHooks(new GraphQLClient(GRAPH_URL_MAINNET)),
  [Chains.goerli]: getSdkWithHooks(new GraphQLClient(GRAPH_URL_GOERLI)),
  [Chains.kovan]: getSdkWithHooks(new GraphQLClient(GRAPH_URL_KOVAN)),
  [Chains.optimism]: getSdkWithHooks(new GraphQLClient(GRAPH_URL_OPTMISM)),
}

export function getSdkByNetwork(chainId: ChainsValues): ReturnType<typeof getSdkWithHooks> {
  const networkConfig = gqlSdkByNetwork[chainId]
  return nullthrows(networkConfig, `No sdk for chain id: ${chainId}`)
}
