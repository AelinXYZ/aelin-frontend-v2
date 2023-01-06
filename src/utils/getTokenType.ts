import { JsonRpcProvider } from '@ethersproject/providers'

import erc1155 from '@/src/abis/ERC1155.json'
import erc721 from '@/src/abis/ERC721.json'
import { ERCInterface, NFTType } from '@/src/hooks/aelin/useNftCollectionLists'
import contractCall from '@/src/utils/contractCall'

const getTokenType = async (address: string, provider: JsonRpcProvider): Promise<NFTType> => {
  const isERC721 = await contractCall(address, erc721, provider, 'supportsInterface', [
    ERCInterface.ERC721,
  ])
  if (isERC721) {
    return NFTType.ERC721
  }
  const isERC1155 = await contractCall(address, erc1155, provider, 'supportsInterface', [
    ERCInterface.ERC1155,
  ])

  if (isERC1155) {
    return NFTType.ERC1155
  }

  throw new Error('Unsupported token type')
}

export default getTokenType
