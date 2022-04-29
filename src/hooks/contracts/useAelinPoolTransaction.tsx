import { BigNumber } from '@ethersproject/bignumber'
import { ContractReceipt, Overrides } from '@ethersproject/contracts'

import useTransaction from './useTransaction'
import aelinPool from '@/src/abis/AelinPool.json'
import { AelinPool } from '@/types/typechain'

export function useAelinPoolTransaction<
  MethodName extends keyof AelinPool['functions'],
  Params extends Parameters<AelinPool[MethodName]>,
>(
  address: string,
  method: MethodName,
): (params: Params, options?: Overrides) => Promise<ContractReceipt | null> {
  const { execute } = useTransaction(address, aelinPool, method)
  return execute
}

export function useAelinPoolEstimate<
  MethodName extends keyof AelinPool['functions'],
  Params extends Parameters<AelinPool[MethodName]>,
>(address: string, method: MethodName): (params: Params) => Promise<BigNumber | null> {
  const { estimate } = useTransaction(address, aelinPool, method)
  return estimate
}
