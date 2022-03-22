import { chainsConfig } from '@/src/constants/chains'
import { AllSDK, getGqlSdkByNetwork } from '@/src/constants/gqlSdkByNetwork'
import isDev from '@/src/utils/isDev'

export default function getAllGqlSDK() {
  const filteredChains = Object.values(chainsConfig).filter(({ isProd }) => isDev !== isProd)

  return filteredChains.reduce((acc, currentChain) => {
    acc[currentChain.id] = getGqlSdkByNetwork(currentChain.id)
    return acc
  }, {} as AllSDK)
}
