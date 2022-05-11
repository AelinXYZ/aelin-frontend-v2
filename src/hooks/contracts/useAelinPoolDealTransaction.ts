import useTransaction from './useTransaction'
import aelinPoolDeal from '@/src/abis/AelinDeal.json'
import { AelinDeal } from '@/types/typechain'
import { UseTransactionReturn } from '@/types/utils'

export function useAelinPoolDealTransaction<
  MethodName extends keyof AelinDeal['functions'],
  Params extends Parameters<AelinDeal[MethodName]>,
>(address: string, method: MethodName): UseTransactionReturn<Params> {
  return useTransaction(address, aelinPoolDeal, method)
}
