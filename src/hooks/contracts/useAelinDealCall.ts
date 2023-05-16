import { JsonRpcProvider } from '@ethersproject/providers'
import { SWRConfiguration } from 'swr'

import useContractCall from './useContractCall'
import AelinDealABI from '@/src/abis/AelinDeal.json'
import AelinDealTransferABI from '@/src/abis/AelinDeal_v1.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { AelinDeal, AelinDealV1 } from '@/types/typechain'

export type AelinDealCombined = AelinDeal & AelinDealV1

export default function useAelinDealCall<MethodName extends keyof AelinDealCombined['functions']>(
  chainId: ChainsValues,
  address: string,
  method: MethodName,
  params: Parameters<AelinDealCombined['functions'][MethodName]>,
  isDealTokenTransferable: boolean,
  options?: SWRConfiguration,
): [ReturnType<AelinDealCombined['functions'][MethodName]> | null, () => void] {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)

  const ABI = isDealTokenTransferable ? AelinDealTransferABI : AelinDealABI

  const [data, refetch] = useContractCall(
    provider,
    address,
    ABI,
    method as string,
    params,
    false,
    options,
  )
  return [data, refetch]
}
