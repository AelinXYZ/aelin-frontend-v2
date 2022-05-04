import { ContractReceipt, Overrides } from '@ethersproject/contracts'

import useTransaction from './useTransaction'
import aelinPoolDeal from '@/src/abis/AelinDeal.json'
import { AelinDeal } from '@/types/typechain'

export function useAelinPoolDealTransaction<
  MethodName extends keyof AelinDeal['functions'],
  Params extends Parameters<AelinDeal[MethodName]>,
>(
  address: string,
  method: MethodName,
): (params: Params, options?: Overrides) => Promise<ContractReceipt | null> {
  const { execute } = useTransaction(address, aelinPoolDeal, method)

  return execute
}
