import { BigNumber } from '@ethersproject/bignumber'
import useSWR from 'swr'

import { ParsedAelinPool } from './useAelinPool'
import useERC1155Balances from './useERC1155Balances'
import { NFTType } from './useNftCollectionLists'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { ParsedOwnedNft } from '@/src/services/nft'

function fetcher(...urls: string[]) {
  const f = (u: string) => fetch(u).then((r) => r.json())
  return Promise.all(urls.map(f))
}

export interface UserNfts {
  [tokenId: string]: ParsedOwnedNft & {
    balance: BigNumber
    blackListed: boolean
    erc1155AmtEligible: string
  }
}

const useUserNftsByCollections = (pool: ParsedAelinPool) => {
  const { nftCollectionRules } = pool

  const { address, appChainId } = useWeb3Connection()

  const urls = nftCollectionRules.map(
    (collectionRule) =>
      `${process.env.NEXT_PUBLIC_SERVERLESS_BASE_URL}/api/nft/${appChainId}/${collectionRule.collectionAddress}/${address}/`,
  )

  const { data, error } = useSWR(urls, fetcher, {
    revalidateOnMount: true,
  })

  const isNftBlackListed = (tokenId: string, collectionAddress: string) => {
    return !!nftCollectionRules?.some((collectionRule) => {
      return (
        collectionRule.erc721Blacklisted.indexOf(tokenId) !== -1 &&
        collectionAddress === collectionRule.collectionAddress.toLowerCase()
      )
    })
  }

  const isERC1155 = nftCollectionRules.some(
    (collectionRule) => collectionRule.nftType === 'ERC1155',
  )

  const nftData: ParsedOwnedNft[] = data?.filter((res) => res.success).map((res) => res.data) || []

  const { balances } = useERC1155Balances(
    isERC1155 ? ([] as ParsedOwnedNft[]).concat(...nftData) : [],
  )

  const getAmtEligible = (collectionAddress: string, tokenId: string): string => {
    const rules = nftCollectionRules.find(
      (r) => r.collectionAddress === collectionAddress && r.erc1155TokenIds.includes(tokenId),
    )

    if (!rules) return '0'

    const tokenIdIndex = rules.erc1155TokenIds.indexOf(tokenId)

    return rules.erc1155TokensAmtEligible[tokenIdIndex]
  }

  const nfts = ([] as ParsedOwnedNft[])
    .concat(...nftData)
    .reduce((prev: UserNfts, curr: ParsedOwnedNft, index: number) => {
      if (
        curr.type === NFTType.ERC1155 &&
        getAmtEligible(curr.contractAddress.toLowerCase(), curr.id) === '0'
      ) {
        return prev
      }
      return {
        ...prev,
        [`${curr.contractAddress.toLowerCase()}-${curr.id}`]: {
          ...curr,
          contractAddress: curr.contractAddress.toLowerCase(),
          blackListed: isNftBlackListed(curr.id, curr.contractAddress.toLowerCase()),
          balance: balances?.length ? balances[index] : BigNumber.from(0),
          erc1155AmtEligible: getAmtEligible(curr.contractAddress.toLowerCase(), curr.id),
        },
      }
    }, {} as UserNfts)

  return {
    nfts,
    error,
  }
}

export default useUserNftsByCollections
