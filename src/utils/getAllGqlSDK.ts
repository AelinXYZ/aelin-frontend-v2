import { SdkWithHooks } from '@/graphql-schema'
import { ChainsValues, chainsConfig } from '@/src/constants/chains'
import { getGqlSdkByNetwork } from '@/src/constants/gqlSdkByNetwork'
import isDev from '@/src/utils/isDev'

export default function getAllGqlSDK() {
  const filteredChains = Object.values(chainsConfig).filter(({ isProd }) =>
    isDev ? true : isProd === true,
  )

  return filteredChains.reduce((acc, currentChain) => {
    acc[currentChain.id] = getGqlSdkByNetwork(currentChain.id)
    return acc
  }, {} as Record<ChainsValues, SdkWithHooks>)
}
