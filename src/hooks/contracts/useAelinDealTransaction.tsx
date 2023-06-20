import Wei from '@synthetixio/wei'

import useTransaction from './useTransaction'
import aelinDeal from '@/src/abis/AelinDeal.json'
import { AelinDeal } from '@/types/typechain'
import { UseTransactionReturn } from '@/types/utils'

export function useAelinDealTransaction<
  MethodName extends keyof AelinDeal['functions'],
  Params extends Parameters<AelinDeal[MethodName]>,
>(address: string, method: MethodName): UseTransactionReturn<Params> {
  return useTransaction(address, aelinDeal, method)
}

export function useAelinDealEstimate<
  MethodName extends keyof AelinDeal['functions'],
  Params extends Parameters<AelinDeal[MethodName]>,
>(
  address: string,
  method: MethodName,
): (params: Params) => Promise<{
  gasLimit: Wei | null
} | null> {
  const { estimate } = useTransaction(address, aelinDeal, method)
  return estimate
}
