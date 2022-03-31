import { ContractReceipt } from '@ethersproject/contracts'

import useTransaction from './useTransaction'
import aelinPool from '@/src/abis/AelinPool.json'
import { AelinPool } from '@/types/typechain'

export default function useAelinPoolTransaction<
  MethodName extends keyof AelinPool['functions'],
  Params extends Parameters<AelinPool[MethodName]>,
>(address: string, method: MethodName): (...params: Params) => Promise<ContractReceipt | null> {
  return useTransaction(address, aelinPool, method)
}
