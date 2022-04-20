import { JsonRpcProvider } from '@ethersproject/providers'

import useContractCall from './useContractCall'
import aelinStaking from '@/src/abis/AelinStaking.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { AelinStaking } from '@/types/typechain'

export default function useStakingRewardsCall<
  MethodName extends keyof AelinStaking['functions'],
  Params extends Parameters<AelinStaking[MethodName]> | null,
  Return extends Awaited<ReturnType<AelinStaking[MethodName]>>,
>(
  chainId: ChainsValues,
  address: string,
  method: MethodName,
  params: Params,
): [Return | null, () => void] {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)

  const [data, refetch] = useContractCall(provider, address, aelinStaking, method, params)
  return [data, refetch]
}
