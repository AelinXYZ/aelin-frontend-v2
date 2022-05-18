import { JsonRpcProvider } from '@ethersproject/providers'

import useContractCall, { useContractCallMultiple } from './useContractCall'
import aelinPool from '@/src/abis/AelinPool.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
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

  const [data, refetch] = useContractCall(provider, address, aelinPool, method, params)
  return [data, refetch]
}

export function useAelinPoolCallMultiple<
  MethodName extends keyof AelinPool['functions'],
  Params extends Parameters<AelinPool[MethodName]> | null,
>(chainId: ChainsValues, address: string, calls: { method: MethodName; params: Params }[]) {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)

  const [data, refetch] = useContractCallMultiple(provider, address, aelinPool, calls)
  return [data, refetch]
}
