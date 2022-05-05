import useTransaction from './useTransaction'
import aelinStaking from '@/src/abis/AelinStaking.json'
import { AelinStaking } from '@/types/typechain'
import { UseTransactionReturn } from '@/types/utils'

export default function useStakingRewardsTransaction<
  MethodName extends keyof AelinStaking['functions'],
  Params extends Parameters<AelinStaking[MethodName]>,
>(address: string, method: MethodName): UseTransactionReturn<Params> {
  return useTransaction(address, aelinStaking, method)
}
