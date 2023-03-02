import styled from 'styled-components'

import CollectionRulesRow, { Row } from './NftCollectionRulesRow'
import { CollectionsData } from './NftCollectionsTable'
import { genericSuspense } from '../../helpers/SafeSuspense'
import { TableBody as BaseTableBody } from '../../pureStyledComponents/common/Table'
import useNftCollectionLists from '@/src/hooks/aelin/useNftCollectionLists'

const TableBody = styled(BaseTableBody)`
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    row-gap: 0px;

    & ${Row}:last-child > * {
      border: none;
    }
  }
`

interface CollectionRulesProps {
  widths: string
  collectionsData: CollectionsData
}

const NftCollectionTableBody = ({ collectionsData, widths }: CollectionRulesProps) => {
  const { data: collections, error } = useNftCollectionLists(
    collectionsData.collectionsRules.map((c) => ({
      collectionAddress: c.collectionAddress,
      nftType: c.nftType,
    })),
    true,
    collectionsData.chainID,
  )

  if (error) {
    throw new Error('Error getting collections')
  }

  if (!collections) return null
  if (!collections.length) return null

  return (
    <TableBody>
      {collectionsData.collectionsRules.map((rules, index) => (
        <CollectionRulesRow
          collection={collections.find(
            (collection) =>
              collection.address.toLowerCase() === rules.collectionAddress.toLowerCase(),
          )}
          isERC1155={collectionsData.isERC1155}
          key={index}
          rules={rules}
          widths={widths}
        />
      ))}
    </TableBody>
  )
}

export default genericSuspense(NftCollectionTableBody)
