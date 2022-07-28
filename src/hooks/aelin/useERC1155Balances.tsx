import { ContractInterface } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'

import { useMulitpleContractCall } from '../contracts/useContractCall'
import erc1155 from '@/src/abis/ERC1155.json'
import { getNetworkConfig } from '@/src/constants/chains'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { ParsedOwnedNft } from '@/src/services/nft'
import { ERC1155, ERC20, ERC721 } from '@/types/typechain'

type TokenContract = ERC20 | ERC721 | ERC1155

export function useTokenCallMultiple<
  MethodName extends keyof TokenContract['functions'],
  Params extends Parameters<TokenContract[MethodName]> | null,
>(
  contract: ContractInterface,
  method: MethodName,
  args: { contractAddress: string; params: Params }[],
) {
  const { appChainId } = useWeb3Connection()

  const provider = new JsonRpcProvider(getNetworkConfig(appChainId).rpcUrl)

  const calls = args.map((arg) => ({
    contractAddress: arg.contractAddress,
    method,
    params: arg.params,
  }))

  const [data, refetch] = useMulitpleContractCall(provider, contract, calls)
  return [data, refetch]
}

function useERC1155Balances(nfts: ParsedOwnedNft[]) {
  const { address: walletAddress } = useWeb3Connection()
  const [balances, refetchBalances] = useTokenCallMultiple(
    erc1155,
    'balanceOf',
    nfts.map((nft: ParsedOwnedNft) => ({
      contractAddress: nft?.contractAddress || ZERO_ADDRESS,
      params: [walletAddress || ZERO_ADDRESS, nft?.id || '0'],
    })),
  )

  return {
    balances,
    refetchBalances,
  }
}

export default useERC1155Balances
