import AelinDealABI from '@/src/abis/AelinDeal.json'
import AelinDealTransferABI from '@/src/abis/AelinDeal_v1.json'
import useTransaction from '@/src/hooks/contracts/useTransaction'
import { AelinDeal, AelinDealV1 } from '@/types/typechain'
import { UseTransactionReturn } from '@/types/utils'

export type AelinDealCombined = AelinDeal & AelinDealV1

export function useAelinDealTransaction<MethodName extends keyof AelinDealCombined['functions']>(
  address: string,
  method: MethodName,
  isDealTokenTransferable: boolean,
): UseTransactionReturn<Parameters<AelinDealCombined['functions'][MethodName]>> {
  const ABI = isDealTokenTransferable ? AelinDealTransferABI : AelinDealABI
  return useTransaction(address, ABI, method as string)
}
