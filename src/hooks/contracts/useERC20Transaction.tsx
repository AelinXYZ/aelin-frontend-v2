import { ContractReceipt, Overrides } from '@ethersproject/contracts'

import useTransaction from './useTransaction'
import erc20 from '@/src/abis/ERC20.json'
import { ERC20 } from '@/types/typechain'

export default function useERC20Transaction<
  MethodName extends keyof ERC20['functions'],
  Params extends Parameters<ERC20[MethodName]>,
>(
  address: string,
  method: MethodName,
): (params: Params, options?: Overrides) => Promise<ContractReceipt | null> {
  const { execute } = useTransaction(address, erc20, method)

  return execute
}
