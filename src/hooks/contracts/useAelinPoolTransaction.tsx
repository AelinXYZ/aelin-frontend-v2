import useTransaction from './useTransaction'
import aelinPool from '@/src/abis/AelinPool.json'
import { AelinPool } from '@/types/typechain'
import { UseTransactionReturn } from '@/types/utils'

export function useAelinPoolTransaction<
  MethodName extends keyof AelinPool['functions'],
  Params extends Parameters<AelinPool[MethodName]>,
>(address: string, method: MethodName): UseTransactionReturn<Params> {
  return useTransaction(address, aelinPool, method)
}
