import { ContractReceipt, Overrides } from '@ethersproject/contracts'

import useTransaction from './useTransaction'
import useTransactionWithModal from './useTransactionWithModal'
import aelinStaking from '@/src/abis/AelinStaking.json'
import { AelinStaking } from '@/types/typechain'
import { ReturnTransactionWithModalHook } from '@/types/utils'

export default function useStakingRewardsTransaction<
  MethodName extends keyof AelinStaking['functions'],
  Params extends Parameters<AelinStaking[MethodName]>,
>(
  address: string,
  method: MethodName,
): (params?: Params, options?: Overrides) => Promise<ContractReceipt | null> {
  const { execute } = useTransaction(address, aelinStaking, method)

  return execute
}

export function useStakingRewardsTransactionWithModal<
  MethodName extends keyof AelinStaking['functions'],
  Params extends Parameters<AelinStaking[MethodName]>,
>(address: string, method: MethodName): ReturnTransactionWithModalHook<Params> {
  const { estimate, getModalTransaction, setShowModalTransaction } = useTransactionWithModal(
    address,
    aelinStaking,
    method,
  )

  return { estimate, setShowModalTransaction, getModalTransaction }
}
