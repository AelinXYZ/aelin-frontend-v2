import { JsonRpcProvider } from '@ethersproject/providers'
import { SWRConfiguration } from 'swr'

import useContractCall, { useContractCallMultiple } from './useContractCall'
import AelinUpfrontDealABI from '@/src/abis/AelinUpfrontDeal.json'
import AelinUpfrontDealTransferABI from '@/src/abis/AelinUpfrontDeal_v1.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { AelinUpfrontDeal, AelinUpfrontDealV1 as AelinUpfrontDealTransfer } from '@/types/typechain'

export type AelinUpfrontDealCombined = AelinUpfrontDeal & AelinUpfrontDealTransfer

export default function useAelinUpfrontDealCall<
  MethodName extends keyof AelinUpfrontDealCombined['functions'],
  Params extends Parameters<AelinUpfrontDealCombined['functions'][MethodName]>,
  Return extends Awaited<ReturnType<AelinUpfrontDealCombined[MethodName]>>,
>(
  chainId: ChainsValues,
  address: string,
  method: MethodName,
  params: Params,
  isUpfrontDealTransferable: boolean,
  options?: SWRConfiguration,
): [Return | null, () => void] {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)

  const [data, refetch] = useContractCall(
    provider,
    address,
    isUpfrontDealTransferable ? AelinUpfrontDealTransferABI : AelinUpfrontDealABI,
    method as string,
    params,
    false,
    options,
  )
  return [data, refetch]
}

export function useAelinUpfrontDealCallMultiple<
  MethodName extends keyof AelinUpfrontDealCombined['functions'],
  Params extends Parameters<AelinUpfrontDealCombined['functions'][MethodName]>,
>(
  chainId: ChainsValues,
  address: string,
  isUpfrontDealTransferable: boolean,
  calls: { method: string; params: Params | string[] }[],
) {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)

  const [data, refetch] = useContractCallMultiple(
    provider,
    address,
    isUpfrontDealTransferable ? AelinUpfrontDealTransferABI : AelinUpfrontDealABI,
    calls,
  )
  return [data, refetch]
}
