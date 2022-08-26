import { JsonRpcProvider } from '@ethersproject/providers'

import useContractCall from './useContractCall'
import erc721 from '@/src/abis/ERC721.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { ERC721 } from '@/types/typechain'

export default function useERC721Call<
  MethodName extends keyof ERC721['functions'],
  Params extends Parameters<ERC721[MethodName]> | null,
  Return extends Awaited<ReturnType<ERC721[MethodName]>>,
>(
  chainId: ChainsValues,
  address: string,
  method: MethodName,
  params: Params,
): [Return | null, () => void] {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)

  const [data, refetch] = useContractCall(provider, address, erc721, method, params)
  return [data, refetch]
}
