import useTransaction from './useTransaction'
import aelinPool from '@/src/abis/AelinPool.json'
import { AelinPool } from '@/types/typechain'
import { TransactionResponse } from '@/types/utils'

export default function useAelinPoolTransaction<
  MethodName extends keyof AelinPool['functions'],
  Params extends Parameters<AelinPool[MethodName]>,
>(
  address: string,
  method: MethodName,
  onlyEstimate?: boolean,
): (...params: Params) => TransactionResponse {
  return useTransaction(address, aelinPool, method, onlyEstimate)
}
