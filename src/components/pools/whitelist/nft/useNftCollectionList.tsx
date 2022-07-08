import Fuse from 'fuse.js'
import useSWR from 'swr'

import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export type NftCollectionData = {
  id: string
  name: string
  itemsCount: number
  ownersCount: number
  floorPrice: number
  volumeTraded: number
  currencyImageUrl: string
  imageUrl: string
  url: string
  nftsIds: string[]
  isVerified: boolean
}

type NFTCollections = {
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

const MAINNET_NFT_COLLECTIONS = '/data/open-sea-metadata.json'
const OPTIMISM_NFT_COLLECTIONS = '/data/quixotic-metadata.json'

function useNftCollectionList(query: string) {
  const { appChainId } = useWeb3Connection()

  return useSWR<NFTCollections[] | unknown[], Error>(
    'search-nft-collections',
    async () => {
      console.log('query: ', query)
      if (!query.length) return []

      const collections = await Promise.all([
        appChainId === 1 && fetch(MAINNET_NFT_COLLECTIONS).then((response) => response.json()),
        appChainId === 10 && fetch(OPTIMISM_NFT_COLLECTIONS).then((response) => response.json()),
      ])

      const response = await fetch(MAINNET_NFT_COLLECTIONS).then((response) => response.json())
      const mainnetCollections = await response.json()

      console.log('mainnetCollections: ', mainnetCollections)
      console.log('collections: ', collections)

      const fuse = new Fuse<NFTCollections>(collections, {
        keys: ['name'],
        includeScore: true,
      })

      const search = fuse.search(query)

      console.log('search: ', search)

      return []
    },
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
    },
  )
}

/*
  return useMemo(() => {
    return {
      collections:
        query === ''
          ? []
          : [
              {
                id: 'aaa',
                name: 'aaa',
                itemsCount: 1,
                ownersCount: 2,
                floorPrice: 3,
                volumeTraded: 4,
                currencyImageUrl: 'https://rarify-public.s3.amazonaws.com/eth_logo.svg',
                imageUrl: 'https://rarify-public.s3.amazonaws.com/cryptopunks.png',
                url: 'https://www.larvalabs.com/cryptopunks',
                nftsIds: ['1', '2', '3'],
                isVerified: true,
              },
              {
                id: 'aab',
                name: 'aab',
                itemsCount: 10,
                ownersCount: 20,
                floorPrice: 30,
                volumeTraded: 40,
                currencyImageUrl: 'https://rarify-public.s3.amazonaws.com/eth_logo.svg',
                imageUrl: 'https://rarify-public.s3.amazonaws.com/cryptopunks.png',
                url: 'https://www.larvalabs.com/cryptopunks',
                nftsIds: ['1', '2', '3'],
                isVerified: false,
              },
              {
                id: 'abb',
                name: 'abb',
                itemsCount: 100,
                ownersCount: 200,
                floorPrice: 300,
                volumeTraded: 400,
                currencyImageUrl: 'https://rarify-public.s3.amazonaws.com/eth_logo.svg',
                imageUrl: 'https://rarify-public.s3.amazonaws.com/cryptopunks.png',
                url: 'https://www.larvalabs.com/cryptopunks',
                nftsIds: ['1', '2', '3'],
                isVerified: false,
              },
              {
                id: 'Bored',
                name: 'Bored',
                itemsCount: 1000,
                ownersCount: 2000,
                floorPrice: 3000,
                volumeTraded: 4000,
                currencyImageUrl: 'https://rarify-public.s3.amazonaws.com/eth_logo.svg',
                imageUrl: 'https://rarify-public.s3.amazonaws.com/cryptopunks.png',
                url: 'https://www.larvalabs.com/cryptopunks',
                nftsIds: ['1', '2', '3', '11', '121', '311', '0'],
                isVerified: true,
              },
              {
                id: 'bbb',
                name: 'bbb',
                itemsCount: 10000,
                ownersCount: 20000,
                floorPrice: 30000,
                volumeTraded: 40000,
                currencyImageUrl: 'https://rarify-public.s3.amazonaws.com/eth_logo.svg',
                imageUrl: 'https://rarify-public.s3.amazonaws.com/cryptopunks.png',
                url: 'https://www.larvalabs.com/cryptopunks',
                nftsIds: ['1', '2', '3'],
                isVerified: false,
              },
              {
                id: 'bbbb',
                name: 'bbbb',
                itemsCount: 100000,
                ownersCount: 200000,
                floorPrice: 300000,
                volumeTraded: 400000,
                currencyImageUrl: 'https://rarify-public.s3.amazonaws.com/eth_logo.svg',
                imageUrl: 'https://rarify-public.s3.amazonaws.com/cryptopunks.png',
                url: 'https://www.larvalabs.com/cryptopunks',
                nftsIds: ['1', '2', '3'],
                isVerified: false,
              },
            ].filter((collection) => collection.name.toLowerCase().includes(query)),
    }
  }, [query])
}

// TODO [AELIP-15]: Replace mock.

// const useNftCollectionList = (query: string) => {
//   const { data } = useSWR<any>([query], async function (query: string) {
//     const response = await fetch(
//       `https://api.rarify.tech/data/contracts?${new URLSearchParams({
//         'filter[name]': 'Bored',
//         include: 'metadata,insights',
//         'insights.period': '90d',
//       }).toString()}`,
//       {
//         method: 'GET',
//         headers: {
//           Authorization: '9cfde46a-b5f4-40ed-8ea4-8dac29784827',
//         },
//       },
//     )
//     const json = await response.json()
//     console.log('xxx json', json)
//     const data = json.data.map((item: any) => item.attributes.name)
//     return data
//   })

//   return data
// }

*/

export default useNftCollectionList
