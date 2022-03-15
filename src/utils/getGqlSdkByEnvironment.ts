import { chainsConfig } from '@/src/constants/chains'
import { getSdkByNetwork } from '@/src/constants/gqlSdkByNetwork'
import isDev from '@/src/utils/isDev'

const getGqlSdkByEnvironment = () => {
  const chainsByEnvironment = Object.values(chainsConfig).filter(({ isProd }) => isDev !== isProd)

  return chainsByEnvironment.reduce(
    (chains, currentChain) => ({ ...chains, [currentChain.id]: getSdkByNetwork(currentChain.id) }),
    {},
  )
}

export default getGqlSdkByEnvironment
