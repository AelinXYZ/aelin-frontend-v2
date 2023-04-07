import { Network, OwnedNft, getNftsForOwner, initializeAlchemy } from '@alch/alchemy-sdk'
import { JsonRpcProvider } from '@ethersproject/providers'

import env from '@/config/env'
import erc1155 from '@/src/abis/ERC1155.json'
import erc721 from '@/src/abis/ERC721.json'
import { Chains, ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { NFTType, NftCollectionData } from '@/src/hooks/aelin/useNftCollectionLists'
import contractCall from '@/src/utils/contractCall'
import { CustomError as Error } from '@/src/utils/error'
import getNftType from '@/src/utils/getNftType'
import { getTokenProvider } from '@/src/utils/getTokenProvider'
import getTokenType from '@/src/utils/getTokenType'

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

const parseAlchemyResponse = (ownedNfts: OwnedNft[]): ParsedOwnedNft[] => {
  return ownedNfts.map((nft: OwnedNft) => ({
    id: nft.tokenId,
    type: getNftType(nft.tokenType),
    contractAddress: nft.contract.address,
    imgUrl: nft.media.length ? nft.media[0].gateway : '',
  }))
}

const parseQuixoticNFTsResponse = async (
  quixoticRes: Response,
  contractAddress: string,
): Promise<ParsedOwnedNft[]> => {
  const data = await quixoticRes.json()
  return data.results
    .map((nft: QuixoticNft) => ({
      id: nft.token_id,
      contractAddress: nft.collection.address,
      imgUrl: nft.image_url,
      type: getNftType(nft.collection.contract_type),
    }))
    .filter(
      (nft: ParsedOwnedNft) => nft.contractAddress.toLowerCase() === contractAddress.toLowerCase(),
    )
}

const parseQuixoticCollectionResponse = async (
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

const parseStratosCollectionResponse = async (
  stratosRes: Response,
): Promise<Omit<NftCollectionData, 'totalSupply'>> => {
  const data = await stratosRes.json()
  return {
    id: 0, // Always return 1 exact collection
    address: data.address,
    name: data.name,
    symbol: data.symbol,
    description: data.description,
    imageUrl: data.image_url,
    contractType: data.contract_type.includes('721') ? NFTType.ERC721 : NFTType.ERC1155,
    network: Chains.arbitrum,
  }
}

const parseSimpleHashCollectionResponse = async (
  simpleHashRes: Response,
  collectionAddress: string,
  chainId: ChainsValues,
): Promise<Omit<NftCollectionData, 'totalSupply'>> => {
  const data = await simpleHashRes.json()
  const collection = data.collections[0]
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)
  const contractType = await getTokenType(collectionAddress, provider)
  const nftAbi = contractType === NFTType.ERC721 ? erc721 : erc1155
  const symbol = await contractCall(collectionAddress, nftAbi, provider, 'symbol', [])

  return {
    id: 0, // Always return 1 exact collection
    address: collectionAddress,
    name: collection?.name,
    slug: collection?.marketplace_pages.find(
      (marketplace: { marketplace_id: string }) => marketplace.marketplace_id === 'opensea',
    )?.marketplace_collection_id,
    symbol: symbol,
    description: collection?.description,
    imageUrl: collection?.image_url,
    contractType: contractType,
    network: chainId,
  }
}

const getAlchemyNetworkId = (chainId: ChainsValues): Network => {
  switch (chainId) {
    case Chains.goerli:
      return Network.ETH_GOERLI
    case Chains.mainnet:
      return Network.ETH_MAINNET
    case Chains.arbitrum:
      return Network.ARB_MAINNET
    case Chains.polygon:
      return Network.MATIC_MAINNET
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
    chainId === Chains.polygon
  ) {
    const settings = {
      apiKey: getTokenProvider(chainId),
      network: getAlchemyNetworkId(chainId),
      maxRetries: 10,
    }

    const alchemy = initializeAlchemy(settings)

    try {
      const ownersForNft = await getNftsForOwner(alchemy, walletAddress, {
        contractAddresses: [collectionAddress],
      })

      return parseAlchemyResponse(ownersForNft.ownedNfts)
    } catch (err) {
      console.log(err)
      throw new Error('Something went wrong getting NFT owned by wallet', 400)
    }
  } else if (chainId === Chains.optimism) {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-KEY': env.QUIXOTIC_API_TOKEN as string,
      },
    }
    const quixoticRes = await fetch(
      `https://api.quixotic.io/api/v1/account/${walletAddress}/assets/`,
      options,
    )
    if (quixoticRes.status !== 200) {
      throw new Error('Quixotic request failed.', 400)
    }
    return parseQuixoticNFTsResponse(quixoticRes, collectionAddress)
  }

  throw new Error('Unsupported network.', 400)
}

export const getNftCollectionData = async (chainId: ChainsValues, collectionAddress: string) => {
  if (chainId === Chains.optimism) {
    // Optimism => Quixotic marketplace
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-KEY': env.QUIXOTIC_API_TOKEN as string,
      },
    }

    const quixoticRes = await fetch(
      `https://api.quixotic.io/api/v1/collection/${collectionAddress}/`,
      options,
    )

    if (quixoticRes.status !== 200) {
      throw new Error('Quixotic request failed.', 400)
    }

    return parseQuixoticCollectionResponse(quixoticRes)
  }

  if (chainId === Chains.arbitrum) {
    // Arbitrum => Stratos marketplace
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-KEY': env.STRATOS_API_TOKEN as string,
      },
    }

    const stratosRes = await fetch(
      `https://api.stratosnft.io/api/v1/collection/${collectionAddress}/`,
      options,
    )

    if (stratosRes.status !== 200) {
      throw new Error('Stratos request failed.', 400)
    }

    return parseStratosCollectionResponse(stratosRes)
  }

  if (chainId === Chains.polygon || chainId === Chains.goerli) {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-KEY': env.SIMPLEHASH_API_KEY as string,
      },
    }

    const simpleHashRes = await fetch(
      `https://api.simplehash.com/api/v0/nfts/collections/${
        chainId === Chains.polygon ? 'polygon' : 'ethereum-goerli'
      }/${collectionAddress}?limit=50`,
      options,
    )

    if (simpleHashRes.status !== 200) {
      throw new Error('SimpleHash request failed.', 400)
    }

    return parseSimpleHashCollectionResponse(simpleHashRes, collectionAddress, chainId)
  }

  throw new Error('Unsupported network.', 400)
}
