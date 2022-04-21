import { BigNumber } from '@ethersproject/bignumber'
import { ContractReceipt } from '@ethersproject/contracts'

import useTransaction from './useTransaction'
import aelinPoolCreate from '@/src/abis/AelinPoolCreate.json'
import { AelinPoolCreate } from '@/types/typechain'

export function useAelinPoolCreateTransaction<
  MethodName extends keyof AelinPoolCreate['functions'],
  Params extends Parameters<AelinPoolCreate[MethodName]>,
>(address: string, method: MethodName): (...params: Params) => Promise<ContractReceipt | null> {
  const { execute } = useTransaction(address, aelinPoolCreate, method)

  return execute
}

export function useAelinPoolCreateEstimate<
  MethodName extends keyof AelinPoolCreate['functions'],
  Params extends Parameters<AelinPoolCreate[MethodName]>,
>(address: string, method: MethodName): (...params: Params) => Promise<BigNumber | null> {
  const { estimate } = useTransaction(address, aelinPoolCreate, method)

  return estimate
}
