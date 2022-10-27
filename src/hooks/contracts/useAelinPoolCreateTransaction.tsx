import { Interface } from '@ethersproject/abi'
import { ContractReceipt } from '@ethersproject/contracts'

import useTransaction from './useTransaction'
import AelinRegularPoolFactoryABI from '@/src/abis/AelinRegularPoolFactory.json'
import { AelinRegularPoolFactory } from '@/types/typechain'
import { UseTransactionReturn } from '@/types/utils'

export function useAelinPoolCreateTransaction<
  MethodName extends keyof AelinRegularPoolFactory['functions'],
  Params extends Parameters<AelinRegularPoolFactory[MethodName]>,
>(address: string, method: MethodName): UseTransactionReturn<Params> {
  return useTransaction(address, AelinRegularPoolFactoryABI, method)
}

/**
 * Get poolCreated ID after transaction is done. Yo need to pass the receipt to get the new poolId
 * @param receipt
 * @returns
 */
export const getPoolCreatedId = (receipt: ContractReceipt) => {
  const poolCreateInterface = new Interface(AelinRegularPoolFactoryABI)
  const parsedLogs = poolCreateInterface.parseLog(receipt.logs[receipt.logs.length - 1])
  return parsedLogs.args[0]
}
