import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { ContractReceipt, Overrides } from '@ethersproject/contracts'

import useTransaction from './useTransaction'
import useTransactionWithModal from './useTransactionWithModal'
import aelinPoolCreate from '@/src/abis/AelinPoolCreate.json'
import { AelinPoolCreate } from '@/types/typechain'
import { ReturnTransactionWithModalHook } from '@/types/utils'

export function useAelinPoolCreateTransaction<
  MethodName extends keyof AelinPoolCreate['functions'],
  Params extends Parameters<AelinPoolCreate[MethodName]>,
>(
  address: string,
  method: MethodName,
): (params: Params, options?: Overrides) => Promise<ContractReceipt | null> {
  const { execute } = useTransaction(address, aelinPoolCreate, method)

  return execute
}

export function useAelinPoolCreateEstimate<
  MethodName extends keyof AelinPoolCreate['functions'],
  Params extends Parameters<AelinPoolCreate[MethodName]>,
>(address: string, method: MethodName): (params: Params) => Promise<BigNumber | null> {
  const { estimate } = useTransaction(address, aelinPoolCreate, method)

  return estimate
}

export function useAelinPoolCreateTxWithModal<
  MethodName extends keyof AelinPoolCreate['functions'],
  Params extends Parameters<AelinPoolCreate[MethodName]>,
>(address: string, method: MethodName): ReturnTransactionWithModalHook<Params> {
  const { estimate, getModalTransaction, setShowModalTransaction } = useTransactionWithModal(
    address,
    aelinPoolCreate,
    method,
  )

  return { estimate, setShowModalTransaction, getModalTransaction }
}

export const getPoolCreatedId = (receipt: ContractReceipt) => {
  const poolCreateInterface = new Interface(aelinPoolCreate)
  const parsedLogs = poolCreateInterface.parseLog(receipt.logs[2])
  return parsedLogs.args[0]
}
