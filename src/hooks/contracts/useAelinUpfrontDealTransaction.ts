import useTransaction from './useTransaction'
import AelinUpfrontDealABI from '@/src/abis/AelinUpfrontDeal.json'
import AelinUpfrontDealTransferABI from '@/src/abis/AelinUpfrontDeal_v1.json'
import { AelinUpfrontDeal, AelinUpfrontDealV1 as AelinUpfrontDealTransfer } from '@/types/typechain'
import { UseTransactionReturn } from '@/types/utils'

export type AelinUpfrontDealCombined = AelinUpfrontDeal & AelinUpfrontDealTransfer

export function useAelinUpfrontDealTransaction<
  MethodName extends keyof AelinUpfrontDealCombined['functions'],
  Params extends Parameters<AelinUpfrontDealCombined['functions'][MethodName]>,
>(
  address: string,
  method: MethodName,
  isUpfrontDealTransferable: boolean,
): UseTransactionReturn<Params> {
  const ABI = isUpfrontDealTransferable ? AelinUpfrontDealTransferABI : AelinUpfrontDealABI
  return useTransaction(address, ABI, method as string)
}
