import useTransaction from './useTransaction'
import aelinUpfrontDeal from '@/src/abis/AelinUpfrontDeal.json'
import { AelinUpfrontDeal } from '@/types/typechain'
import { UseTransactionReturn } from '@/types/utils'

export function useAelinPoolUpfrontDealTransaction<
  MethodName extends keyof AelinUpfrontDeal['functions'],
  Params extends Parameters<AelinUpfrontDeal[MethodName]>,
>(address: string, method: MethodName): UseTransactionReturn<Params> {
  return useTransaction(address, aelinUpfrontDeal, method)
}
