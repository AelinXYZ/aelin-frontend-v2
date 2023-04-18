import { Nft } from './models/SimpleHashRes'
import env from '@/config/env'
import { Chains, ChainsValues } from '@/src/constants/chains'
import { NFTType, NftCollectionData } from '@/src/hooks/aelin/useNftCollectionLists'
import { CustomError as Error } from '@/src/utils/error'
import getNftType from '@/src/utils/getNftType'

export interface ParsedOwnedNft {
  id: string
  contractAddress: string
  imgUrl?: string
  type: NFTType
}

export interface QuixoticNft {
  token_id: string
  name: string
  description: string
  image_url: string
  animation_url: null
  background_color: null
  collection: {
    address: string
    name: string
    symbol: string
    contract_type: string
    external_link: string
    slug: string
    image_url: string
    verified: boolean
  }
}

const parseSimpleHashNFTsResponse = async (res: Response): Promise<ParsedOwnedNft[]> => {
  const ret = (await res.json()).nfts.map((nft: Nft) => ({
    id: nft.token_id,
    type: nft.contract.type,
    contractAddress: nft.contract_address,
    imgUrl: nft.image_url,
  }))

  return ret
}

const parseSimpleHashCollectionResponse = async (
  simpleHashRes: Response,
  collectionAddress: string,
  chainId: ChainsValues,
): Promise<Omit<NftCollectionData, 'totalSupply'>> => {
  const data = await simpleHashRes.json()
  const nft = data.nfts[0]

  console.log(nft)
  return {
    id: 0, // Always return 1 exact collection
    address: collectionAddress,
    name: nft.collection?.name,
    slug: nft.collection?.marketplace_pages.find(
      (marketplace: { marketplace_id: string }) => marketplace.marketplace_id === 'opensea',
    )?.marketplace_collection_id,
    symbol: nft.contract.symbol,
    description: nft.collection?.description,
    imageUrl: nft.collection?.image_url,
    contractType: getNftType(nft.contract.type),
    network: chainId,
  }
}

const getSimpleHashNetwork = (chainId: ChainsValues): string => {
  switch (chainId) {
    case Chains.goerli:
      return 'ethereum-goerli'
    case Chains.mainnet:
      return 'ethereum'
    case Chains.arbitrum:
      return 'arbitrum'
    case Chains.polygon:
      return 'polygon'
    case Chains.optimism:
      return 'optimism'
    default:
      throw new Error('Unsupported network.', 400)
  }
}

export const getNftOwnedByAddress = async (
  chainId: ChainsValues,
  collectionAddress: string,
  walletAddress: string,
) => {
  if (
    chainId === Chains.goerli ||
    chainId === Chains.mainnet ||
    chainId === Chains.arbitrum ||
    chainId === Chains.polygon ||
    chainId === Chains.optimism
  ) {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-KEY': env.SIMPLEHASH_API_KEY as string,
      },
    }

    const simpleHashRes = await fetch(
      `https://api.simplehash.com/api/v0/nfts/owners?chains=${getSimpleHashNetwork(
        chainId,
      )}&wallet_addresses=${walletAddress}&contract_addresses=${collectionAddress}&limit=50`,
      options,
    )

    if (simpleHashRes.status !== 200) {
      throw new Error('SimpleHash request failed.', 400)
    }

    return await parseSimpleHashNFTsResponse(simpleHashRes)
  } else {
    throw new Error('Unsupported network.', 400)
  }
}

export const getNftCollectionData = async (chainId: ChainsValues, collectionAddress: string) => {
  if (
    chainId === Chains.mainnet ||
    chainId === Chains.arbitrum ||
    chainId === Chains.polygon ||
    chainId === Chains.optimism ||
    chainId === Chains.goerli
  ) {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-KEY': env.SIMPLEHASH_API_KEY as string,
      },
    }

    const simpleHashRes = await fetch(
      `https://api.simplehash.com/api/v0/nfts/${getSimpleHashNetwork(
        chainId,
      )}/${collectionAddress}?limit=1`,
      options,
    )

    if (simpleHashRes.status !== 200) {
      throw new Error(`SimpleHash request failed.`, 400)
    }

    return parseSimpleHashCollectionResponse(simpleHashRes, collectionAddress, chainId)
  }

  throw new Error('Unsupported network.', 400)
}
