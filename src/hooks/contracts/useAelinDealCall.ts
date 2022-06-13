import { JsonRpcProvider } from '@ethersproject/providers'
import { SWRConfiguration } from 'swr'

import useContractCall from './useContractCall'
import AelinDealABI from '@/src/abis/AelinDeal.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { AelinDeal } from '@/types/typechain'

export default function useAelinDealCall<
  MethodName extends keyof AelinDeal['functions'],
  Params extends Parameters<AelinDeal[MethodName]> | null,
  Return extends Awaited<ReturnType<AelinDeal[MethodName]>>,
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
    AelinDealABI,
    method,
    params,
    false,
    options,
  )
  return [data, refetch]
}
