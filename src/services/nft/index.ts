import { Network, OwnedNft, getNftsForOwner, initializeAlchemy } from '@alch/alchemy-sdk'

import { Chains, ChainsValues } from '@/src/constants/chains'
import { CustomError as Error } from '@/src/utils/error'

export interface ParsedOwnedNft {
  id: string
  contractAddress: string
  imgUrl?: string
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
    contractAddress: nft.contract.address,
    imgUrl: nft.media[0].gateway,
  }))
}

const parseQuixoticResponse = async (quixoticRes: Response): Promise<ParsedOwnedNft[]> => {
  const data = await quixoticRes.json()
  return data.results.map((nft: QuixoticNft) => ({
    id: nft.token_id,
    contractAddress: nft.collection.address,
    imgUrl: nft.image_url,
  }))
}

export const getNftOwnedByAddress = async (
  chainId: ChainsValues,
  collectionAddress: string,
  walletAddress: string,
) => {
  if (chainId === Chains.mainnet) {
    const settings = {
      apiKey: process.env.ALCHEMY_API_KEY_MAINNET,
      network: Network.ETH_MAINNET,
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
    return parseQuixoticResponse(quixoticRes)
  } else if (chainId === Chains.goerli) {
    // PUT HERE THE NFTs <<YOU OWN>> TO TEST GOERLI POOLS
    return [
      {
        id: '1',
        contractAddress: '0x56E89a09CE99445044E979F43b038CB9e55a0688',
        imgUrl: 'https://ipfs.io/ipfs/bafkreigcentehhdnbbk57x3mu6exjvtlp4k4fqqhkdpxg4xlfbevywcuvm',
      },
      {
        id: '2',
        contractAddress: '0x56E89a09CE99445044E979F43b038CB9e55a0688',
        imgUrl: 'https://ipfs.io/ipfs/bafkreidwycvpunxiyz4hewq3htynvrj63umkruysshwwud56ko66i4xvsa',
      },
    ]
  }

  throw new Error('Unsupported network.', 400)
}
