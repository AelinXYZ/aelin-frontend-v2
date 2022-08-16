import { NftTokenType } from '@alch/alchemy-sdk'

import { NFTType } from '../hooks/aelin/useNftCollectionList'

const getNftType = (nft: NftTokenType | string): NFTType => {
  if (typeof nft === 'string') {
    return nft.includes('721')
      ? NFTType.ERC721
      : nft.includes('1155')
      ? NFTType.ERC1155
      : NFTType.PUNKS
  }
  return nft === NftTokenType.ERC721
    ? NFTType.ERC721
    : nft === NftTokenType.ERC1155
    ? NFTType.ERC1155
    : NFTType.UNKNOWN
}

export default getNftType
