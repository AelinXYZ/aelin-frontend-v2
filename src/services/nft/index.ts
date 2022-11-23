import { Network, OwnedNft, getNftsForOwner, initializeAlchemy } from '@alch/alchemy-sdk'
import { getAddress } from '@ethersproject/address'

import { Chains, ChainsValues } from '@/src/constants/chains'
import { NFTType, NftCollectionData } from '@/src/hooks/aelin/useNftCollectionLists'
import { CustomError as Error } from '@/src/utils/error'
import getNftType from '@/src/utils/getNftType'
import { getTokenProvider } from '@/src/utils/getTokenProvider'

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

export const getNftOwnedByAddress = async (
  chainId: ChainsValues,
  collectionAddress: string,
  walletAddress: string,
) => {
  if (chainId === Chains.mainnet || chainId === Chains.arbitrum || chainId === Chains.polygon) {
    const settings = {
      apiKey: getTokenProvider(chainId),
      network:
        chainId === Chains.mainnet
          ? Network.ETH_MAINNET
          : chainId === Chains.arbitrum
          ? Network.ARB_MAINNET
          : Network.MATIC_MAINNET,
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
        'X-API-KEY': process.env.QUIXOTIC_API_TOKEN as string,
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
  } else if (chainId === Chains.goerli) {
    // Saeta dev address
    if (getAddress('0xa834e550B45B4a469a05B846fb637bfcB12e3Df8') === getAddress(walletAddress)) {
      return [
        {
          id: '373814',
          contractAddress: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
          imgUrl:
            'https://ipfs.io/ipfs/bafybeiezeds576kygarlq672cnjtimbsrspx5b3tr3gct2lhqud6abjgiu',
        },
        {
          id: '373813',
          contractAddress: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
          imgUrl:
            'https://ipfs.io/ipfs/bafybeiezeds576kygarlq672cnjtimbsrspx5b3tr3gct2lhqud6abjgiu',
        },
        {
          id: '373812',
          contractAddress: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
          imgUrl:
            'https://ipfs.io/ipfs/bafybeiezeds576kygarlq672cnjtimbsrspx5b3tr3gct2lhqud6abjgiu',
        },
      ]
    }

    // Linus dev address
    if (getAddress('0xEade2f82c66eBda112987edd95E26cd3088f33DD') === getAddress(walletAddress)) {
      return [
        {
          id: '1199',
          contractAddress: '0x39Ec448b891c476e166b3C3242A90830DB556661',
          imgUrl:
            'https://ipfs.io/ipfs/bafkreigcentehhdnbbk57x3mu6exjvtlp4k4fqqhkdpxg4xlfbevywcuvm',
        },
        {
          id: '1160',
          contractAddress: '0x39Ec448b891c476e166b3C3242A90830DB556661',
          imgUrl:
            'https://ipfs.io/ipfs/bafkreidwycvpunxiyz4hewq3htynvrj63umkruysshwwud56ko66i4xvsa',
        },
        {
          id: '373815',
          contractAddress: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
          imgUrl: 'https://live---metadata-5covpqijaa-uc.a.run.app/images/1',
        },
      ]
    }

    // Dmitry dev address
    if (getAddress('0x4F1abd0E5c4506C95a4Fd5259371BD9a877D9488') === getAddress(walletAddress)) {
      return [
        {
          id: '934080',
          contractAddress: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
          imgUrl:
            'https://ipfs.io/ipfs/bafkreigcentehhdnbbk57x3mu6exjvtlp4k4fqqhkdpxg4xlfbevywcuvm',
        },
        {
          id: '934079',
          contractAddress: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
          imgUrl:
            'https://ipfs.io/ipfs/bafkreidwycvpunxiyz4hewq3htynvrj63umkruysshwwud56ko66i4xvsa',
        },
        {
          id: '934078',
          contractAddress: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
          imgUrl: 'https://live---metadata-5covpqijaa-uc.a.run.app/images/1',
        },
      ]
    }
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

    return parseQuixoticCollectionResponse(quixoticRes)
  }

  if (chainId === Chains.arbitrum) {
    // Arbitrum => Stratos marketplace
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-KEY': process.env.STRATOS_API_TOKEN as string,
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

  throw new Error('Unsupported network.', 400)
}
