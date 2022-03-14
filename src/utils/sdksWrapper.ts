import { chainsConfigWithSdk } from '@/src/constants/chainsWithSdk'
import isDev from '@/src/utils/isDev'

const getWrappedSdks = () => {
  const chainsArr = Object.values(chainsConfigWithSdk)
  return chainsArr
    .filter(({ isProd }) => isProd !== isDev)
    .reduce(
      (chains, currentChain) => ({ ...chains, [currentChain.id]: currentChain.graphClientSDK }),
      {},
    )
}

export default getWrappedSdks
