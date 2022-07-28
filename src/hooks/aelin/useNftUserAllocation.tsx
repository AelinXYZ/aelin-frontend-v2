import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { ParsedAelinPool } from './useAelinPool'
import { SelectedNfts } from '@/src/providers/nftSelectionProvider'
import { ParsedNftCollectionRules } from '@/src/utils/aelinPoolUtils'

function useNftUserAllocation(nfts: SelectedNfts, pool: ParsedAelinPool) {
  const isERC721Unlimited = pool?.nftCollectionRules.some(
    (collectionRule) =>
      collectionRule.purchaseAmount.formatted === '0' && collectionRule.nftType === 'ERC721',
  )

  const isERC1155 = pool?.nftCollectionRules.some(
    (collectionRule) => collectionRule.nftType === 'ERC1155',
  )

  const isERC1155Unlimited = useMemo(() => {
    if (!isERC1155) {
      return false
    }

    return Object.values(pool.nftCollectionRules).every(
      (collectionRule: ParsedNftCollectionRules) => {
        const collectionNftsSelected = Object.values(nfts).filter(
          (nft) =>
            nft.selected &&
            nft.contractAddress.toLowerCase() === collectionRule.collectionAddress.toLowerCase(),
        )

        return collectionRule.erc1155TokenIds.every((tokenId, index) => {
          const erc1155TokenAmtEligible = collectionRule.erc1155TokensAmtEligible[index]
          return collectionNftsSelected.some(
            (nft) => nft.id === tokenId && nft.balance.gte(BigNumber.from(erc1155TokenAmtEligible)),
          )
        })
      },
    )
  }, [isERC1155, nfts, pool.nftCollectionRules])

  const allocation = useMemo(() => {
    if (!nfts || !pool.nftCollectionRules) return 0

    return Object.values(pool.nftCollectionRules).reduce(
      (acc: number, collectionRule: ParsedNftCollectionRules) => {
        const collectionNftsSelected = Object.values(nfts).filter(
          (nft) =>
            nft.selected &&
            nft.contractAddress.toLowerCase() === collectionRule.collectionAddress.toLowerCase(),
        )

        if (collectionRule.purchaseAmountPerToken) {
          // Add allocation granted per collection's nft
          return (
            acc + Number(collectionRule.purchaseAmount.formatted) * collectionNftsSelected.length
          )
        } else {
          // Add allocation granted if user owns at least one nft of the collection
          return collectionNftsSelected.length
            ? acc + Number(collectionRule.purchaseAmount.formatted)
            : 0
        }
      },
      0,
    )
  }, [nfts, pool.nftCollectionRules])

  return isERC721Unlimited || isERC1155Unlimited ? 'Unlimited' : `${allocation}`
}

export default useNftUserAllocation
