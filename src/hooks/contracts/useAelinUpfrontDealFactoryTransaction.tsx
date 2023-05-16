import { Interface } from '@ethersproject/abi'
import { ContractReceipt } from '@ethersproject/contracts'

import useTransaction from './useTransaction'
import AelinUpfrontDealFactory from '@/src/abis/AelinUpfrontDealFactory.json'
import { AelinUpfrontDealFactory as AelinUpfrontDealFactoryType } from '@/types/typechain'
import { UseTransactionReturn } from '@/types/utils'

export function useAelinUpfrontDealFactoryTransaction<
  MethodName extends keyof AelinUpfrontDealFactoryType['functions'],
  Params extends Parameters<AelinUpfrontDealFactoryType[MethodName]>,
>(address: string, method: MethodName): UseTransactionReturn<Params> {
  return useTransaction(address, AelinUpfrontDealFactory, method)
}

/**
 * Get poolCreated ID after transaction is done. Yo need to pass the receipt to get the new poolId
 * @param receipt
 * @returns
 */
export const getDealCreatedId = (receipt: ContractReceipt) => {
  const dealCreateInterface = new Interface(AelinUpfrontDealFactory)
  const parsedLogs = dealCreateInterface.parseLog(receipt.logs[receipt.logs.length - 1])
  return parsedLogs.args[0]
}
