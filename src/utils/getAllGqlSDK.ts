import { SdkWithHooks } from '@/graphql-schema'
import { ChainsValues, chainsConfig } from '@/src/constants/chains'
import { getSdkByNetwork } from '@/src/constants/gqlSdkByNetwork'
import isDev from '@/src/utils/isDev'

export default function getAllGqlSDK() {
  const filteredChains = Object.values(chainsConfig).filter(({ isProd }) => isDev !== isProd)

  return filteredChains.reduce((acc, currentChain) => {
    acc[currentChain.id] = getSdkByNetwork(currentChain.id)
    return acc
  }, {} as Record<ChainsValues, SdkWithHooks>)
}
