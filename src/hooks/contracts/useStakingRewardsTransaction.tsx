import { ContractReceipt } from '@ethersproject/contracts'

import useTransaction from './useTransaction'
import aelinStaking from '@/src/abis/AelinStaking.json'
import { AelinStaking } from '@/types/typechain'

export default function useStakingRewardsTransaction<
  MethodName extends keyof AelinStaking['functions'],
  Params extends Parameters<AelinStaking[MethodName]>,
>(address: string, method: MethodName): (...params: Params) => Promise<ContractReceipt | null> {
  return useTransaction(address, aelinStaking, method)
}
