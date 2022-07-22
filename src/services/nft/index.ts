import { Chains, ChainsValues } from '@/src/constants/chains'
import { NFTType, NftCollectionData } from '@/src/hooks/aelin/useNftCollectionList'
import { CustomError as Error } from '@/src/utils/error'

const parseQuixoticResponse = async (
  quixoticRes: Response,
): Promise<Omit<NftCollectionData, 'totalSupply'>> => {
  const data = await quixoticRes.json()
  return {
    id: 0, // Always return 1 exact collection
    address: data.address,
    name: data.name,
    symbol: data.symbol,
    description: data.description,
    imageUrl: data.image_url,
    contractType: data.contract_type.includes('721') ? NFTType.ERC721 : NFTType.ERC1155,
    network: Chains.optimism,
  }
}

export const getNftCollectionData = async (chainId: ChainsValues, collectionAddress: string) => {
  if (chainId === Chains.optimism) {
    //Optimism => Quixotic marketplace
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-KEY': process.env.QUIXOTIC_API_TOKEN as string,
      },
    }

    const quixoticRes = await fetch(
      `https://api.quixotic.io/api/v1/collection/${collectionAddress}/`,
      options,
    )

    if (quixoticRes.status !== 200) {
      throw new Error('Quixotic request failed.', 400)
    }

    return parseQuixoticResponse(quixoticRes)
  }
  throw new Error('Something went Wrong.', 400)
}
