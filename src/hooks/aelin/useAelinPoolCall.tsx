import { JsonRpcProvider } from '@ethersproject/providers'

import aelinPoolAbi from '@/src/abis/AelinPool.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import useContractCall from '@/src/hooks/useContractCall'
import { AelinPool } from '@/types/typechain'

export default function useAelinPoolCall<
  MethodName extends keyof AelinPool['functions'],
  Params extends Parameters<AelinPool[MethodName]> | null,
  Return extends Awaited<ReturnType<AelinPool[MethodName]>>,
>(
  chainId: ChainsValues,
  address: string,
  method: MethodName,
  params: Params,
): [Return | null, () => void] {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)
  const [data, refetch] = useContractCall(provider, address, aelinPoolAbi, method, params)
  return [data, refetch]
}
