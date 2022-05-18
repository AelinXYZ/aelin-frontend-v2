import { ChainsValues } from '@/src/constants/chains'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'

export function useUserAllocationStat(poolAddress: string | null, chainId: ChainsValues) {
  const { address } = useWeb3Connection()
  const allSDK = getAllGqlSDK()
  const { useUserAllocationStat: gqlCall } = allSDK[chainId]
  return gqlCall({
    id: `${(address || ZERO_ADDRESS).toLowerCase()}-${poolAddress}`,
  })
}
