import useTransaction from './useTransaction'
import AelinPoolABI from '@/src/abis/AelinPool_v1.json'
import { AelinPoolV1 as AelinPool } from '@/types/typechain'
import { UseTransactionReturn } from '@/types/utils'

export function useAelinPoolTransaction<
  MethodName extends keyof AelinPool['functions'],
  Params extends Parameters<AelinPool[MethodName]>,
>(address: string, method: MethodName): UseTransactionReturn<Params> {
  return useTransaction(address, AelinPoolABI, method)
}
