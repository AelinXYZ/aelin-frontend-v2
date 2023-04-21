import { useEffect, useMemo, useState } from 'react'

import { isAddress } from '@ethersproject/address'
import { JsonRpcProvider } from '@ethersproject/providers'
import Fuse from 'fuse.js'
import useSWR from 'swr'

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
  symbol?: string | null
  description?: string | null
  imageUrl?: string
  totalSupply: number
  slug?: string
  isVerified?: boolean
  numOwners?: number
  floorPrice?: number
  totalVolume?: number
  updatedAt?: string
}

import AELIN_ARBITRUM_NFT_COLLECTIONS from '@/public/data/nft-metadata/aelin-arbitrum-metadata.json'
import AELIN_MAINNET_NFT_COLLECTIONS from '@/public/data/nft-metadata/aelin-mainnet-metadata.json'
import AELIN_OPTIMISM_NFT_COLLECTIONS from '@/public/data/nft-metadata/aelin-optimism-metadata.json'
import AELIN_POLYGON_NFT_COLLECTIONS from '@/public/data/nft-metadata/aelin-polygon-metadata.json'
import GOERLI_NFT_COLLECTIONS from '@/public/data/nft-metadata/goerli-metadata.json'
import MAINNET_NFT_COLLECTIONS from '@/public/data/nft-metadata/open-sea-mainnet-metadata.json'
import POLYGON_NFT_COLLECTIONS from '@/public/data/nft-metadata/open-sea-polygon-metadata.json'
import OPTIMISM_NFT_COLLECTIONS from '@/public/data/nft-metadata/quixotic-metadata.json'
import ARBITRUM_NFT_COLLECTIONS from '@/public/data/nft-metadata/stratos-metadata.json'
import erc1155 from '@/src/abis/ERC1155.json'
import erc721 from '@/src/abis/ERC721.json'
import { Chains, ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import contractCall from '@/src/utils/contractCall'
import getTokenType from '@/src/utils/getTokenType'
import { shortenAddress } from '@/src/utils/string'

const getParsedNFTCollectionData = async (collectionAddress: string, chainId: ChainsValues) => {
  const url = `/api/nft/${chainId}/${collectionAddress}`

  return fetch(url).then(async (res) => {
    if (res.status !== 200) return
    return res.json()
  })
}

export interface CollectionInfo {
  collectionAddress: string
  nftType: NFTType
}

function useNftCollectionLists(
  collectionsData: CollectionInfo[],
  suspense = false,
  chainId?: ChainsValues,
) {
  const { appChainId: connectedChainId } = useWeb3Connection()
  const [collections, setCollections] = useState<NftCollectionData[]>([])

  const appChainId = useMemo(() => {
    if (chainId) {
      return chainId
    }

    return connectedChainId
  }, [chainId, connectedChainId])

  useEffect(() => {
    const fetchCollections = async (appChainId: ChainsValues) => {
      const aelinMainnetCollections: any = AELIN_ARBITRUM_NFT_COLLECTIONS
      const aelinOptimismCollections: any = AELIN_OPTIMISM_NFT_COLLECTIONS
      const aelinArbitrumCollections: any = AELIN_ARBITRUM_NFT_COLLECTIONS
      const aelinPolygonCollections: any = AELIN_POLYGON_NFT_COLLECTIONS
      const mainnetCollections: any = MAINNET_NFT_COLLECTIONS
      const optimismCollections: any = OPTIMISM_NFT_COLLECTIONS
      const arbitrumCollections: any = ARBITRUM_NFT_COLLECTIONS
      const polygonCollections: any = POLYGON_NFT_COLLECTIONS
      const goerliCollections: any = GOERLI_NFT_COLLECTIONS

      const collections: NftCollectionData[] = (
        await Promise.all([
          // NFTs added manually
          appChainId === Chains.mainnet && fetch(aelinMainnetCollections).then((r) => r.json()),
          appChainId === Chains.optimism && fetch(aelinOptimismCollections).then((r) => r.json()),
          appChainId === Chains.arbitrum && fetch(aelinArbitrumCollections).then((r) => r.json()),
          appChainId === Chains.polygon && fetch(aelinPolygonCollections).then((r) => r.json()),
          // NFTs fetched by API
          appChainId === Chains.mainnet && fetch(mainnetCollections).then((r) => r.json()),
          appChainId === Chains.optimism && fetch(optimismCollections).then((r) => r.json()),
          appChainId === Chains.arbitrum && fetch(arbitrumCollections).then((r) => r.json()),
          appChainId === Chains.polygon && fetch(polygonCollections).then((r) => r.json()),
          // NFT for testing reasons
          appChainId === Chains.goerli && fetch(goerliCollections).then((r) => r.json()),
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
