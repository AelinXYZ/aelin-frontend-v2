import { useEffect, useMemo, useState } from 'react'

import { isAddress } from '@ethersproject/address'
import { JsonRpcProvider } from '@ethersproject/providers'
import Fuse from 'fuse.js'
import useSWR from 'swr'

import erc1155 from '@/src/abis/ERC1155.json'
import erc721 from '@/src/abis/ERC721.json'
import { Chains, ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import contractCall from '@/src/utils/contractCall'

export enum NFTType {
  ERC721 = 'erc721',
  ERC1155 = 'erc1155',
  PUNKS = 'cryptopunks',
}

export enum ERCInterface {
  ERC721 = '0x80ac58cd',
  ERC1155 = '0xd9b67a26',
}

export enum NFTType {
  ERC721 = 'erc721',
  ERC1155 = 'erc1155',
  PUNKS = 'cryptopunks',
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
    contractType: data.schema_name.includes('721') ? NFTType.ERC721 : NFTType.ERC1155,
    network: Chains.mainnet,
  }
}

const getParsedNFTCollectionData = async (collectionAddress: string, chainId: ChainsValues) => {
  const url =
    chainId === Chains.optimism
      ? `/api/nft/${Chains.optimism}/${collectionAddress}`
      : `https://api.opensea.io/api/v1/asset_contract/${collectionAddress}?format=json`

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
    contractType: data.schema_name.includes('721') ? NFTType.ERC721 : NFTType.ERC1155,
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

function useNftCollectionList(query: string, nftType: NFTType) {
  const { appChainId } = useWeb3Connection()
  const [collections, setCollections] = useState<NftCollectionData[]>([])

  const isCollectionAddress = useMemo(() => {
    return isAddress(query)
  }, [query])

  useEffect(() => {
    const fetchCollections = async (appChainId: ChainsValues) => {
      const collections: NftCollectionData[] = (
        await Promise.all([
          appChainId === Chains.mainnet && fetch(MAINNET_NFT_COLLECTIONS).then((r) => r.json()),
          appChainId === Chains.optimism && fetch(OPTIMISM_NFT_COLLECTIONS).then((r) => r.json()),
          appChainId === Chains.goerli && fetch(GOERLI_NFT_COLLECTIONS).then((r) => r.json()),
        ])
      )
        .filter(Boolean)
        .flat()

      setCollections(collections)
    }

    try {
      fetchCollections(appChainId)
    } catch (err) {
      console.log('effect', err)
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

  return useSWR<NftCollectionData[], Error>(
    ['search-nft-collections', query, collections, isCollectionAddress],
    async () => {
      if (!query.length) return []

      if (isCollectionAddress) {
        const res: { data: NftCollectionData } = await getParsedNFTCollectionData(query, appChainId)
        const provider = new JsonRpcProvider(getNetworkConfig(appChainId).rpcUrl)
        if (!res?.data) {
          // no data found in marketplace, wrong address or unknown error
          // Get minimal information directly from the contract

          try {
            const contractType = await getTokenType(query, provider)

            // NFTType of the address typed does not match with the one selected
            if (contractType !== nftType) return []

            const nftAbi = contractType === NFTType.ERC721 ? erc721 : erc1155

            const name = await contractCall(query, nftAbi, provider, 'name', [])
            // A name is the minimum info needed
            if (!name) return []

            const totalSupply =
              contractType === NFTType.ERC721
                ? await contractCall(query, erc721, provider, 'totalSupply', [])
                : undefined
            const symbol = await contractCall(query, nftAbi, provider, 'symbol', [])
            return [
              {
                id: 0,
                address: query,
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
            ? await contractCall(query, erc721, provider, 'totalSupply', [])
            : undefined
        return [{ ...res.data, totalSupply: totalSupply?.toNumber() || 0 }]
      }

      const fuse = new Fuse<NftCollectionData>(collections, {
        keys: ['name'],
        includeScore: true,
      })

      const responses = fuse.search(query)

      return responses
        .map((r) => r.item)
        .filter((r) => {
          const contractType = r.contractType
          const chainId = r.network
          if (contractType === NFTType.PUNKS && appChainId === Chains.mainnet) return true

          return chainId === appChainId && contractType === nftType
        })
    },
    {
      suspense: false,
      revalidateOnFocus: true,
      revalidateOnMount: true,
    },
  )
}

export default useNftCollectionList
