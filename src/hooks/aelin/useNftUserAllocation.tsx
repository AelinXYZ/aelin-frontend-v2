import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { ParsedAelinPool } from './useAelinPool'
import { ZERO_BN } from '@/src/constants/misc'
import { useNftSelection } from '@/src/providers/nftSelectionProvider'
import { ParsedNftCollectionRules } from '@/src/utils/aelinPoolUtils'
import { formatToken } from '@/src/web3/bigNumber'

function useNftUserAllocation(pool: ParsedAelinPool) {
  const { lastSelectedNfts, selectedNfts } = useNftSelection()

  const nfts = useMemo(() => {
    if (Object.values(lastSelectedNfts).length) return lastSelectedNfts
    return selectedNfts
  }, [lastSelectedNfts, selectedNfts])

  const isERC721Unlimited = pool?.nftCollectionRules.some((collectionRule) => {
    const collectionNftsSelected = Object.values(nfts).filter(
      (nft) =>
        nft.selected &&
        nft.contractAddress.toLowerCase() === collectionRule.collectionAddress.toLowerCase(),
    )

    return (
      collectionRule.purchaseAmount.raw.eq(ZERO_BN) &&
      collectionRule.nftType === 'ERC721' &&
      collectionNftsSelected.some((nft) => !!nft?.selected)
    )
  })

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
    if (!nfts || !pool.nftCollectionRules) return BigNumber.from(0)

    return Object.values(pool.nftCollectionRules).reduce(
      (acc: BigNumber, collectionRule: ParsedNftCollectionRules) => {
        const collectionNftsSelected = Object.values(nfts).filter(
          (nft) =>
            nft.selected &&
            nft.contractAddress.toLowerCase() === collectionRule.collectionAddress.toLowerCase(),
        )

        if (collectionRule.purchaseAmountPerToken) {
          // Add allocation granted per collection's nft
          return acc.add(
            collectionRule.purchaseAmount.raw.mul(BigNumber.from(collectionNftsSelected.length)),
          )
        } else {
          // Add allocation granted if user owns at least one nft of the collection
          return collectionNftsSelected.length ? acc.add(collectionRule.purchaseAmount.raw) : acc
        }
      },
      BigNumber.from(0),
    )
  }, [nfts, pool.nftCollectionRules])

  return {
    formatted: formatToken(allocation, 18, 4),
    raw: allocation,
    unlimited: isERC721Unlimited || isERC1155Unlimited,
  }
}

export default useNftUserAllocation
