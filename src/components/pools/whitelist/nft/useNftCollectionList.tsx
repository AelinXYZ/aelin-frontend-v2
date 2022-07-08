import Fuse from 'fuse.js'
import useSWR from 'swr'

import { Chains } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export type NftCollectionData = {
  id: string
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

  return useSWR<NftCollectionData[], Error>(
    'search-nft-collections',
    async () => {
      const optimimsmCollectionsResponse = await fetch(OPTIMISM_NFT_COLLECTIONS)
      const optimismCollections = await optimimsmCollectionsResponse.json()

      const mainnetCollectionsResponse = await fetch(MAINNET_NFT_COLLECTIONS)
      const mainnetCollections = await mainnetCollectionsResponse.json()

      const collections = []

      switch (appChainId) {
        case Chains.mainnet: {
          collections.push(...mainnetCollections)
          break
        }
        case Chains.optimism: {
          collections.push(...optimismCollections)
          break
        }
        default: {
          collections.push(...mainnetCollections)
          collections.push(...optimismCollections)
          break
        }
      }

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
