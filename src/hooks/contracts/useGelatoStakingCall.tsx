import { JsonRpcProvider } from '@ethersproject/providers'

import gelatoPoolAbi from '@/src/abis/GelatoPool.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import useContractCall from '@/src/hooks/contracts/useContractCall'
import { GelatoPool } from '@/types/typechain'

export default function useGelatipStakingCall<
  MethodName extends keyof GelatoPool['functions'],
  Params extends Parameters<GelatoPool[MethodName]> | null,
  Return extends Awaited<ReturnType<GelatoPool[MethodName]>>,
>(
  chainId: ChainsValues,
  address: string,
  method: MethodName,
  params: Params,
): [Return | null, () => void] {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)
  const [data, refetch] = useContractCall(provider, address, gelatoPoolAbi, method, params)
  return [data, refetch]
}
