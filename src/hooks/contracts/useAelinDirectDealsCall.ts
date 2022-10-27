import { JsonRpcProvider } from '@ethersproject/providers'
import { SWRConfiguration } from 'swr'

import useContractCall, { useContractCallMultiple } from './useContractCall'
import AelinUpfrontDealABI from '@/src/abis/AelinUpfrontDeal.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { AelinUpfrontDeal } from '@/types/typechain'

export default function useAelinDirectDealCall<
  MethodName extends keyof AelinUpfrontDeal['functions'],
  Params extends Parameters<AelinUpfrontDeal[MethodName]> | null,
  Return extends Awaited<ReturnType<AelinUpfrontDeal[MethodName]>>,
>(
  chainId: ChainsValues,
  address: string,
  method: MethodName,
  params: Params,
  options?: SWRConfiguration,
): [Return | null, () => void] {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)

  const [data, refetch] = useContractCall(
    provider,
    address,
    AelinUpfrontDealABI,
    method,
    params,
    false,
    options,
  )
  return [data, refetch]
}

export function useAelinDirectDealCallMultiple<
  MethodName extends keyof AelinUpfrontDeal['functions'],
  Params extends Parameters<AelinUpfrontDeal[MethodName]> | null,
>(chainId: ChainsValues, address: string, calls: { method: MethodName; params: Params }[]) {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)

  const [data, refetch] = useContractCallMultiple(provider, address, AelinUpfrontDealABI, calls)
  return [data, refetch]
}
