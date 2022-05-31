import { chainsConfig } from '@/src/constants/config/chains'
import { AllSDK, getGqlSdkByNetwork } from '@/src/constants/config/gqlSdkByNetwork'
import isDev from '@/src/utils/isDev'

export default function getAllGqlSDK() {
  const filteredChains = Object.values(chainsConfig).filter(({ isProd }) => isDev !== isProd)

  return filteredChains.reduce((acc, currentChain) => {
    acc[currentChain.chainId] = getGqlSdkByNetwork(currentChain.chainId)
    return acc
  }, {} as AllSDK)
}
