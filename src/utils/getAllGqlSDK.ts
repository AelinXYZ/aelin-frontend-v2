import { chainsConfig } from '@/src/constants/chains'
import { AllSDK, getGqlSdkByNetwork } from '@/src/constants/gqlSdkByNetwork'
import isDev from '@/src/utils/isDev'

export default function getAllGqlSDK() {
  const filteredChains = Object.values(chainsConfig).filter(({ isProd }) => isDev !== isProd)

  return filteredChains.reduce((acc, currentChainConfig) => {
    acc[currentChainConfig.chainId] = getGqlSdkByNetwork(currentChainConfig.chainId)
    return acc
  }, {} as AllSDK)
}
