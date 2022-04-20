import useTransaction from './useTransaction'
import aelinPoolCreate from '@/src/abis/AelinPoolCreate.json'
import { AelinPoolCreate } from '@/types/typechain'
import { TransactionResponse } from '@/types/utils'

export default function useAelinPoolCreateTransaction<
  MethodName extends keyof AelinPoolCreate['functions'],
  Params extends Parameters<AelinPoolCreate[MethodName]>,
>(
  address: string,
  method: MethodName,
  onlyEstimate?: boolean,
): (...params: Params) => TransactionResponse {
  return useTransaction(address, aelinPoolCreate, method, onlyEstimate)
}
