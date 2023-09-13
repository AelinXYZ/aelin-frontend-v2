import { JsonRpcProvider } from '@ethersproject/providers'

import useContractCall from './useContractCall'
import swapAelin from '@/src/abis/SwapAelin.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { SwapAelin } from '@/types/typechain'

export function useSwapAelinCall<
  MethodName extends keyof SwapAelin['functions'],
  Params extends Parameters<SwapAelin[MethodName]> | null,
  Return extends Awaited<ReturnType<SwapAelin[MethodName]>>,
>(
  chainId: ChainsValues,
  address: string,
  method: MethodName,
  params: Params,
): [Return | null, () => void] {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)

  const [data, refetch] = useContractCall(provider, address, swapAelin, method, params)
  return [data, refetch]
}
