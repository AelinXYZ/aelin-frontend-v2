import { useMemo } from 'react'

import { ParsedAelinPool } from '../useAelinPool'
import { NFTType } from '../useNftCollectionLists'
import { CollectionRulesData } from '@/src/components/pools/nftTable/NftCollectionRulesRow'
import { CollectionsData } from '@/src/components/pools/nftTable/NftCollectionsTable'
import { NftWhiteListState } from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { ChainsValues } from '@/src/constants/chains'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { Token } from '@/src/constants/token'
import formatNumber from '@/src/utils/formatNumber'
import { formatToken } from '@/src/web3/bigNumber'

const useNftCollectionTableData = (
  pool?: ParsedAelinPool,
  nftCollectionsData?: NftWhiteListState & Token,
) => {
  const isERC1155 = useMemo(() => {
    if (pool) {
      return !!pool.nftCollectionRules.some(
        (collectionRule) => collectionRule.nftType === 'ERC1155',
      )
    }

    return !!nftCollectionsData?.nftType.includes('1155')
  }, [pool, nftCollectionsData])

  const widths = useMemo(() => {
    if (isERC1155) {
      return '25px 1fr 70px 1fr'
    }

    return '25px 1fr 1fr'
  }, [isERC1155])

  const tableHeaderCells = useMemo(() => {
    if (isERC1155) {
      return ['', 'Collections', 'ID', 'Amount needed']
    }

    return ['', 'Collections', 'Allocation per NFT']
  }, [isERC1155])

  const collectionsData = useMemo<CollectionsData | null>(() => {
    if (nftCollectionsData) {
      const nftType = isERC1155 ? NFTType.ERC1155 : NFTType.ERC721
      const collectionsRules = nftCollectionsData.selectedCollections
        .filter((c) => !!c.nftCollectionData?.address)
        .map((collection) => {
          const collectionsRules: CollectionRulesData = {
            investmentTokenDecimals: nftCollectionsData.decimals,
            investmentTokenSymbol: nftCollectionsData.symbol,
            collectionAddress: collection.nftCollectionData?.address || ZERO_ADDRESS,
            nftType,
            allocationErc721: '',
            allocationsErc1155: [],
          }

          if (nftType === NFTType.ERC721) {
            collectionsRules.allocationErc721 = collection.amountPerNft
              ? `${formatNumber(collection.amountPerNft, nftCollectionsData.decimals)} ${
                  nftCollectionsData.symbol
                }`
              : 'Unlimited'
          } else {
            collectionsRules.allocationsErc1155 = collection.selectedNftsData
              .filter((n) => !!n.nftId)
              .map((nftAllocData) => ({
                nftID: nftAllocData.nftId?.toString() || '',
                amountNeeded: nftAllocData.minimumAmount.toString(),
              }))
          }
          return collectionsRules
        })
      return {
        collectionsRules,
        isERC1155,
        chainID: nftCollectionsData.chainId as ChainsValues,
      }
    }

    if (!pool) {
      return null
    }

    const collectionsRules = pool.nftCollectionRules.map((rules) => {
      const nftType = isERC1155 ? NFTType.ERC1155 : NFTType.ERC721
      const collectionsRules: CollectionRulesData = {
        investmentTokenDecimals: pool.investmentTokenDecimals,
        investmentTokenSymbol: pool.investmentTokenSymbol,
        collectionAddress: rules.collectionAddress,
        nftType,
        allocationErc721: '',
        allocationsErc1155: [],
      }

      if (nftType === NFTType.ERC721) {
        collectionsRules.allocationErc721 = rules.purchaseAmount.raw.eq(ZERO_BN)
          ? 'Unlimited'
          : `${formatToken(
              rules.purchaseAmount.raw,
              pool.investmentTokenDecimals,
              pool.investmentTokenDecimals,
            )} ${pool.investmentTokenSymbol}`
      } else {
        collectionsRules.allocationsErc1155 = rules.erc1155TokenIds.map((nftID) => ({
          nftID,
          amountNeeded: rules.erc1155TokensAmtEligible[rules.erc1155TokenIds.indexOf(nftID)],
        }))
      }

      return collectionsRules
    })

    return {
      collectionsRules,
      isERC1155,
      chainID: pool.chainId,
    }
  }, [pool, nftCollectionsData, isERC1155])

  return { isERC1155, widths, collectionsData, tableHeaderCells }
}

export default useNftCollectionTableData
