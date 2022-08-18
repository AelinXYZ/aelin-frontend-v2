import { useEffect, useState } from 'react'

import { isAddress } from '@ethersproject/address'
import { JsonRpcProvider } from '@ethersproject/providers'
import Fuse from 'fuse.js'
import useSWR from 'swr'

import erc1155 from '@/src/abis/ERC1155.json'
import erc721 from '@/src/abis/ERC721.json'
import { Chains, ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import contractCall from '@/src/utils/contractCall'
import getNftType from '@/src/utils/getNftType'
import { shortenAddress } from '@/src/utils/string'

export enum NFTType {
  ERC721 = 'erc721',
  ERC1155 = 'erc1155',
  PUNKS = 'cryptopunks',
  UNKNOWN = 'unknown',
}

export enum ERCInterface {
  ERC721 = '0x80ac58cd',
  ERC1155 = '0xd9b67a26',
}

export type NftCollectionData = {
  id: number
  address: string
  name: string
  network: ChainsValues
  contractType: NFTType
  symbol?: string
  description?: string
  imageUrl?: string
  totalSupply: number
  slug?: string
  isVerified?: boolean
  numOwners?: number
  floorPrice?: number
  totalVolume?: number
  paymentSymbol?: string
}

const AELIN_MAINNET_NFT_COLLECTIONS = '/data/nft-metadata/aelin-mainnet-metadata.json'
const AELIN_OPTIMISM_NFT_COLLECTIONS = '/data/nft-metadata/aelin-optimism-metadata.json'
const MAINNET_NFT_COLLECTIONS = '/data/nft-metadata/opensea-metadata.json'
const OPTIMISM_NFT_COLLECTIONS = '/data/nft-metadata/quixotic-metadata.json'
const GOERLI_NFT_COLLECTIONS = '/data/nft-metadata/goerli-metadata.json'

const parseOpenseaResponse = async (
  openSeaRes: Response,
): Promise<Omit<NftCollectionData, 'totalSupply'>> => {
  const data = await openSeaRes.json()
  return {
    id: 0,
    address: data.address,
    name: data.name,
    symbol: data.symbol,
    description: data.description,
    imageUrl: data.image_url,
    contractType: getNftType(data.schema_name),
    network: Chains.mainnet,
  }
}

const getParsedNFTCollectionData = async (collectionAddress: string, chainId: ChainsValues) => {
  const url =
    chainId === Chains.optimism
      ? `/api/nft/${Chains.optimism}/${collectionAddress}`
      : `https://api.opensea.io/api/v1/asset_contract/${collectionAddress}?format=json`

  return fetch(url).then(async (res) => {
    if (res.status !== 200) return
    if (chainId === Chains.optimism) return res.json()
    return { data: await parseOpenseaResponse(res) }
  })
}

export interface CollectionInfo {
  collectionAddress: string
  nftType: NFTType
}

function useNftCollectionLists(collectionsData: CollectionInfo[], suspense = false) {
  const { appChainId } = useWeb3Connection()
  const [collections, setCollections] = useState<NftCollectionData[]>([])

  useEffect(() => {
    const fetchCollections = async (appChainId: ChainsValues) => {
      const collections: NftCollectionData[] = (
        await Promise.all([
          // NFTs added manually
          appChainId === Chains.mainnet &&
            fetch(AELIN_MAINNET_NFT_COLLECTIONS).then((r) => r.json()),
          appChainId === Chains.optimism &&
            fetch(AELIN_OPTIMISM_NFT_COLLECTIONS).then((r) => r.json()),
          // NFTs fetched by API
          appChainId === Chains.mainnet && fetch(MAINNET_NFT_COLLECTIONS).then((r) => r.json()),
          appChainId === Chains.optimism && fetch(OPTIMISM_NFT_COLLECTIONS).then((r) => r.json()),
          // NFT for testing reasons
          appChainId === Chains.goerli && fetch(GOERLI_NFT_COLLECTIONS).then((r) => r.json()),
        ])
      )
        .filter(Boolean)
        .flat()

      setCollections(collections)
    }

    try {
      fetchCollections(appChainId)
    } catch (_) {
      setCollections([])
    }
  }, [appChainId])

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

  const fetchData = async (collectionData: CollectionInfo) => {
    if (
      !collectionData ||
      (collectionData && (!collectionData.collectionAddress || !collectionData.nftType))
    ) {
      return []
    }

    const { collectionAddress, nftType } = collectionData

    if (isAddress(collectionAddress)) {
      const res: { data: NftCollectionData } = await getParsedNFTCollectionData(
        collectionAddress,
        appChainId,
      )
      const provider = new JsonRpcProvider(getNetworkConfig(appChainId).rpcUrl)

      if (!res?.data) {
        // no data found in marketplace, wrong address or unknown error
        // Get minimal information directly from the contract
        try {
          const contractType = await getTokenType(collectionAddress, provider)

          // NFTType of the address typed does not match with the one selected
          if (contractType !== nftType) return []

          const nftAbi = contractType === NFTType.ERC721 ? erc721 : erc1155

          let name = await contractCall(collectionAddress, nftAbi, provider, 'name', [])
          if (!name) {
            name = shortenAddress(collectionAddress) || ''
          }

          const totalSupply =
            contractType === NFTType.ERC721
              ? await contractCall(collectionAddress, erc721, provider, 'totalSupply', [])
              : undefined
          const symbol = await contractCall(collectionAddress, nftAbi, provider, 'symbol', [])
          return [
            {
              id: 0,
              address: collectionAddress,
              name,
              symbol,
              totalSupply: totalSupply ?? 0,
              network: appChainId,
              contractType,
            },
          ]
        } catch (_) {
          return []
        }
      }

      if (res.data.contractType !== nftType) return []

      const totalSupply =
        res.data.contractType === NFTType.ERC721
          ? await contractCall(collectionAddress, erc721, provider, 'totalSupply', [])
          : undefined

      let name = res.data.name
      if (!name) {
        name = shortenAddress(collectionAddress) || ''
      }

      return [{ ...res.data, name, totalSupply: totalSupply?.toNumber() || 0 }]
    }

    const fuse = new Fuse<NftCollectionData>(collections, {
      keys: ['name'],
      includeScore: true,
    })

    const responses = fuse.search(collectionAddress)

    return responses
      .map((r) => r.item)
      .filter((r) => {
        const contractType = r.contractType
        const chainId = r.network

        if (contractType === NFTType.PUNKS && appChainId === Chains.mainnet) return true

        return chainId === appChainId && contractType === nftType
      })
  }

  const fetcher = (collectionsData: CollectionInfo[]) => {
    return Promise.all(collectionsData.map(fetchData)).then((data) =>
      ([] as NftCollectionData[]).concat(...data),
    )
  }

  return useSWR<NftCollectionData[], Error>([collectionsData], fetcher, {
    suspense,
  })
}

export default useNftCollectionLists
