import useTransaction from './useTransaction'
import nftWaiver from '@/src/abis/NftWaiverContract.json'
import { NftWaiverContract } from '@/types/typechain'
import { UseTransactionReturn } from '@/types/utils'

export function useNftWaiverTransaction<
  MethodName extends keyof NftWaiverContract['functions'],
  Params extends Parameters<NftWaiverContract[MethodName]>,
>(address: string, method: MethodName): UseTransactionReturn<Params> {
  return useTransaction(address, nftWaiver, method)
}
