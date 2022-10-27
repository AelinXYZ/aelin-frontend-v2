import { Interface } from '@ethersproject/abi'
import { ContractReceipt } from '@ethersproject/contracts'

import useTransaction from './useTransaction'
import AelinDirectDealFactoryABI from '@/src/abis/AelinDirectDealFactory.json'
import { AelinDirectDealFactory } from '@/types/typechain'
import { UseTransactionReturn } from '@/types/utils'

export function useAelinDirectDealCreateTransaction<
  MethodName extends keyof AelinDirectDealFactory['functions'],
  Params extends Parameters<AelinDirectDealFactory[MethodName]>,
>(address: string, method: MethodName): UseTransactionReturn<Params> {
  return useTransaction(address, AelinDirectDealFactoryABI, method)
}

/**
 * Get poolCreated ID after transaction is done. Yo need to pass the receipt to get the new poolId
 * @param receipt
 * @returns
 */
export const getDealCreatedId = (receipt: ContractReceipt) => {
  const dealCreateInterface = new Interface(AelinDirectDealFactoryABI)
  const parsedLogs = dealCreateInterface.parseLog(receipt.logs[receipt.logs.length - 1])
  return parsedLogs.args[0]
}
