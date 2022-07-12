import { useEffect, useState } from 'react'

import Fuse from 'fuse.js'
import useSWR from 'swr'

import { Chains, ChainsValues } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import isDev from '@/src/utils/isDev'

export type NftCollectionData = {
  id: number
  address: string
  name: string
  slug: string | null
  imageUrl: string
  isVerified: boolean
  numOwners: number
  totalSupply: number
  floorPrice: number | null
  totalVolume: number | null
  paymentSymbol: string | null
  network: number
}

const MAINNET_NFT_COLLECTIONS = '/data/nft-metadata/opensea-metadata.json'
const OPTIMISM_NFT_COLLECTIONS = '/data/nft-metadata/quixotic-metadata.json'

function useNftCollectionList(query: string) {
  const { appChainId } = useWeb3Connection()
  const [collections, setCollections] = useState<NftCollectionData[]>([])

  useEffect(() => {
    const fetchCollections = async (appChainId: ChainsValues) => {
      const collections: NftCollectionData[] = (
        await Promise.all([
          (appChainId === Chains.mainnet || isDev) &&
            fetch(MAINNET_NFT_COLLECTIONS).then((r) => r.json()),
          (appChainId === Chains.optimism || isDev) &&
            fetch(OPTIMISM_NFT_COLLECTIONS).then((r) => r.json()),
        ])
      )
        .filter(Boolean)
        .flat()

      setCollections(collections)
    }

    fetchCollections(appChainId)
  }, [appChainId])

  return useSWR<NftCollectionData[], Error>(
    ['search-nft-collections', query, collections],
    async () => {
      if (!query.length) return []

      const fuse = new Fuse<NftCollectionData>(collections, {
        keys: ['name'],
        includeScore: true,
      })

      const responses = fuse.search(query)

      return responses.map((r) => r.item)
    },
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
    },
  )
}

export default useNftCollectionList
