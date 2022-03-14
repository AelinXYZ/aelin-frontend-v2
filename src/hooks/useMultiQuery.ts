import { ChainsValues } from '@/src/constants/chains'
import getWrappedSdks from '@/src/utils/sdksWrapper'

export default function useQuery(
  queryName: string, // Todo: here is possible to match the string value with query name in queries folder?
  isMultiChain: boolean,
  chainsIds?: ChainsValues[],
) {
  const wrappedSdks = getWrappedSdks()
  const sdksChains = Object.keys(wrappedSdks)

  if (isMultiChain) []

  // if (sdksChains.some((r) => chainsIds.includes(r))) {
  //   console.log('valid chains')
  // }
}
