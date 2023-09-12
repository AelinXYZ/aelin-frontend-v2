import useTransaction from './useTransaction'
import swapAelin from '@/src/abis/SwapAelin.json'
import { SwapAelin } from '@/types/typechain'
import { UseTransactionReturn } from '@/types/utils'

export function useSwapAelinTransaction<
  MethodName extends keyof SwapAelin['functions'],
  Params extends Parameters<SwapAelin[MethodName]>,
>(address: string, method: MethodName): UseTransactionReturn<Params> {
  return useTransaction(address, swapAelin, method)
}
