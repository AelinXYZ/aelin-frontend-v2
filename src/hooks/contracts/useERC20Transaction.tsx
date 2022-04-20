import useTransaction from './useTransaction'
import erc20 from '@/src/abis/ERC20.json'
import { ERC20 } from '@/types/typechain'
import { TransactionResponse } from '@/types/utils'

export default function useERC20Transaction<
  MethodName extends keyof ERC20['functions'],
  Params extends Parameters<ERC20[MethodName]>,
>(address: string, method: MethodName): (...params: Params) => TransactionResponse {
  return useTransaction(address, erc20, method)
}
