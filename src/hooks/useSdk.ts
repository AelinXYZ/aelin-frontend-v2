import { ChainsValues, chainsConfig } from '@/src/constants/chains'
import { getSdkByNetwork } from '@/src/constants/gqlSdkByNetwork'
import getGqlSdkByEnvironment from '@/src/utils/getGqlSdkByEnvironment'
import isDev from '@/src/utils/isDev'

export default function useSdk(chainsIds?: ChainsValues[]) {
  if (!chainsIds?.length) {
    return getGqlSdkByEnvironment()
  } else {
    const chainsIdArrByEnvironment = Object.values(chainsConfig)
      .filter(({ isProd }) => isDev !== isProd)
      .map(({ id }) => id)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore TODO fix types here.
    if (chainsIdArrByEnvironment.includes(chainsIds)) {
      return chainsIds.reduce(
        (chains, currentChain) => ({
          ...chains,
          [currentChain]: getSdkByNetwork(currentChain),
        }),
        {},
      )
    } else {
      throw 'You try to use an invalid network in the current environment'
    }
  }
}
