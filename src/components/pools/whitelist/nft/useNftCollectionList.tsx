import { useMemo } from 'react'

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
  isVerified: boolean
}

function useNftCollectionList(query: string) {
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

export default useNftCollectionList
