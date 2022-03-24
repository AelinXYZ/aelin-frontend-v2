import { JsonRpcProvider } from '@ethersproject/providers'

import useContractCall from './useContractCall'
import erc20 from '@/src/abis/ERC20.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { ERC20 } from '@/types/typechain'

export default function useERC20Call<
  MethodName extends keyof ERC20['functions'],
  Params extends Parameters<ERC20[MethodName]> | null,
  Return extends Awaited<ReturnType<ERC20[MethodName]>>,
>(
  chainId: ChainsValues,
  address: string,
  method: MethodName,
  params: Params,
): [Return | null, () => void] {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)

  const [data, refetch] = useContractCall(provider, address, erc20, method, params)
  return [data, refetch]
}
