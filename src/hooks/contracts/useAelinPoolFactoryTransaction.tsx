import { Interface } from '@ethersproject/abi'
import { ContractReceipt } from '@ethersproject/contracts'

import useTransaction from './useTransaction'
import AelinPoolFactoryABI from '@/src/abis/AelinPoolFactory.json'
import { AelinPoolFactory } from '@/types/typechain'
import { UseTransactionReturn } from '@/types/utils'

export function useAelinPoolFactoryTransaction<
  MethodName extends keyof AelinPoolFactory['functions'],
  Params extends Parameters<AelinPoolFactory[MethodName]>,
>(address: string, method: MethodName): UseTransactionReturn<Params> {
  return useTransaction(address, AelinPoolFactoryABI, method)
}

/**
 * Get poolCreated ID after transaction is done. Yo need to pass the receipt to get the new poolId
 * @param receipt
 * @returns
 */
export const getPoolCreatedId = (receipt: ContractReceipt) => {
  const poolCreateInterface = new Interface(AelinPoolFactoryABI)
  const parsedLogs = poolCreateInterface.parseLog(receipt.logs[receipt.logs.length - 1])
  return parsedLogs.args[0]
}
