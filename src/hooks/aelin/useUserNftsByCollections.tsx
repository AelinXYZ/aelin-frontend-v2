import { BigNumber } from '@ethersproject/bignumber'
import useSWR from 'swr'

import { ParsedAelinPool } from './useAelinPool'
import useERC1155Balances from './useERC1155Balances'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { ParsedOwnedNft } from '@/src/services/nft'

function fetcher(...urls: string[]) {
  const f = (u: string) => fetch(u).then((r) => r.json())
  return Promise.all(urls.map(f))
}

export interface UserNfts {
  [tokenId: string]: ParsedOwnedNft & { balance: BigNumber }
}

const useUserNftsByCollections = (pool: ParsedAelinPool) => {
  const { nftCollectionRules } = pool

  const { address, appChainId } = useWeb3Connection()

  const urls = nftCollectionRules.map(
    (collectionRule) => `/api/nft/${appChainId}/${collectionRule.collectionAddress}/${address}`,
  )

  const { data, error } = useSWR(urls, fetcher, {
    revalidateOnMount: true,
  })

  const isNftBlackListed = (tokenId: string) => {
    return !!nftCollectionRules?.some((collectionRule) => {
      return collectionRule.erc721Blacklisted.indexOf(tokenId) !== -1
    })
  }

  const isERC1155 = nftCollectionRules.some(
    (collectionRule) => collectionRule.nftType === 'ERC1155',
  )

  const nftData: ParsedOwnedNft[] = data?.filter((res) => res.success).map((res) => res.data) || []

  const { balances } = useERC1155Balances(
    isERC1155 ? ([] as ParsedOwnedNft[]).concat(...nftData) : [],
  )

  const nfts = ([] as ParsedOwnedNft[]).concat(...nftData).reduce(
    (prev: UserNfts, curr: ParsedOwnedNft, index: number) => ({
      ...prev,
      [`${curr.contractAddress}-${curr.id}`]: {
        ...curr,
        blackListed: isNftBlackListed(curr.id),
        balance: balances?.length ? balances[index] : BigNumber.from(0),
      },
    }),
    {} as UserNfts,
  )

  return {
    nfts,
    error,
  }
}

export default useUserNftsByCollections
