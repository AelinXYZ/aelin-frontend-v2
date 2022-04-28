import { BigNumber } from '@ethersproject/bignumber'
import { ContractReceipt } from '@ethersproject/contracts'

import useTransaction from './useTransaction'
import aelinDeal from '@/src/abis/AelinDeal.json'
import { AelinDeal } from '@/types/typechain'

export function useAelinDealTransaction<
  MethodName extends keyof AelinDeal['functions'],
  Params extends Parameters<AelinDeal[MethodName]>,
>(address: string, method: MethodName): (...params: Params) => Promise<ContractReceipt | null> {
  const { execute } = useTransaction(address, aelinDeal, method)
  return execute
}

export function useAelinDealEstimate<
  MethodName extends keyof AelinDeal['functions'],
  Params extends Parameters<AelinDeal[MethodName]>,
>(address: string, method: MethodName): (...params: Params) => Promise<BigNumber | null> {
  const { estimate } = useTransaction(address, aelinDeal, method)
  return estimate
}
