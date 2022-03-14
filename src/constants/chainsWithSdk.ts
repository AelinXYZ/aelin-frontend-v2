import { GraphQLClient } from 'graphql-request'
import nullthrows from 'nullthrows'

import { getSdkWithHooks } from '@/graphql-schema'
import { ChainConfig, Chains, ChainsValues, chainsConfig } from '@/src/constants/chains'
import {
  GRAPH_URL_GOERLI,
  GRAPH_URL_KOVAN,
  GRAPH_URL_MAINNET,
  GRAPH_URL_OPTMISM,
} from '@/src/constants/endpoints'

export interface ChainConfigWithSdk extends ChainConfig {
  graphClientSDK: ReturnType<typeof getSdkWithHooks>
}

// Set the queries SDK on chainConfig object.
export const chainsConfigWithSdk: Record<ChainsValues, ChainConfigWithSdk> = {
  [Chains.mainnet]: {
    ...chainsConfig[Chains.mainnet],
    graphClientSDK: getSdkWithHooks(new GraphQLClient(GRAPH_URL_MAINNET)),
  },
  [Chains.goerli]: {
    ...chainsConfig[Chains.goerli],
    graphClientSDK: getSdkWithHooks(new GraphQLClient(GRAPH_URL_GOERLI)),
  },
  [Chains.kovan]: {
    ...chainsConfig[Chains.kovan],
    graphClientSDK: getSdkWithHooks(new GraphQLClient(GRAPH_URL_KOVAN)),
  },
  [Chains.optimism]: {
    ...chainsConfig[Chains.optimism],
    graphClientSDK: getSdkWithHooks(new GraphQLClient(GRAPH_URL_OPTMISM)),
  },
}

export function getNetworkConfigWithSdk(chainId: ChainsValues): ChainConfigWithSdk {
  const networkConfig = chainsConfigWithSdk[chainId]
  return nullthrows(networkConfig, `No config for chain id: ${chainId}`)
}
