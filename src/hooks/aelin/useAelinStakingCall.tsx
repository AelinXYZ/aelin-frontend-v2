import { JsonRpcProvider } from '@ethersproject/providers'

import aelinPoolAbi from '@/src/abis/AelinPool.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import useContractCall from '@/src/hooks/contracts/useContractCall'
import { AelinStaking } from '@/types/typechain'

export default function useAelinStakingCall<
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
  const [data, refetch] = useContractCall(provider, address, aelinPoolAbi, method, params)
  return [data, refetch]
}
