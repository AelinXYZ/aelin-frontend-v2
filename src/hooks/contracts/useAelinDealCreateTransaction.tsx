import { ContractReceipt } from '@ethersproject/contracts'

import useTransaction from './useTransaction'
import aelinPoolCreate from '@/src/abis/AelinPoolCreate.json'
import { AelinPoolCreate } from '@/types/typechain'

export default function useAelinPoolCreateTransaction<
  MethodName extends keyof AelinPoolCreate['functions'],
  Params extends Parameters<AelinPoolCreate[MethodName]>,
>(address: string, method: MethodName): (...params: Params) => Promise<ContractReceipt | null> {
  return useTransaction(address, aelinPoolCreate, method)
}
