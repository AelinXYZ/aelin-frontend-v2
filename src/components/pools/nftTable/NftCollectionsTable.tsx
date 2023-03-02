import styled from 'styled-components'

import NftCollectionTableBody from './NftCollectionTableBody'
import { TableCard as BaseTableCard } from '../../history/common/TableWrapper'
import { BaseCard } from '../../pureStyledComponents/common/BaseCard'
import { TableHead as BaseTableHead } from '../../pureStyledComponents/common/Table'
import { SortableTH as BaseSortableTH } from '../../table/SortableTH'
import { NftWhiteListState } from '../whitelist/nft/nftWhiteListReducer'
import { ChainsValues } from '@/src/constants/chains'
import { Token } from '@/src/constants/token'
import useNftCollectionTableData from '@/src/hooks/aelin/nftTable/useNftCollectionTableData'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { NFTType } from '@/src/hooks/aelin/useNftCollectionLists'

const SortableTH = styled(BaseSortableTH)``

const TableHead = styled(BaseTableHead)`
  margin-bottom: 3px;
  padding-bottom: 0;
  padding-top: 0;
  & ${SortableTH}:nth-child(2) {
    grid-column: 1/3;
  }
`

const Title = styled.h4`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 5px;
  text-align: left;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    padding-left: 28px;
  }
`

const Card = styled(BaseCard)<{ light?: boolean }>`
  background-color: ${({ light }) => (light ? 'rgba(255, 255, 255, 0.04)' : 'none')};
  width: 100%;
`

const TableCard = styled(BaseTableCard)`
  padding: 0;
  order: 3;
`

const Wrapper: React.FC = ({ children, ...restProps }) => (
  <TableCard {...restProps}>{children}</TableCard>
)

export interface AllocationErc1155 {
  nftID: string
  amountNeeded: string
}

interface CollectionRulesData {
  investmentTokenDecimals: number
  investmentTokenSymbol: string
  collectionAddress: string
  nftType: NFTType
  allocationErc721: string
  allocationsErc1155: AllocationErc1155[]
}

export interface CollectionsData {
  collectionsRules: CollectionRulesData[]
  isERC1155: boolean
  chainID: ChainsValues
}

export const NftCollectionsTable = ({
  light,
  nftCollectionsData,
  pool,
}: {
  pool?: ParsedAelinPool
  nftCollectionsData?: NftWhiteListState & Token
  light?: boolean
}) => {
  const { collectionsData, isERC1155, tableHeaderCells, widths } = useNftCollectionTableData(
    pool,
    nftCollectionsData,
  )

  return (
    <>
      {!!collectionsData && (
        <Wrapper>
          <Card light={light}>
            <Title>NFT Collections</Title>
            <TableHead columns={widths} id="thead">
              {tableHeaderCells
                .filter((header) => !(header === 'ID' && !isERC1155))
                .map((header, index) => (
                  <SortableTH key={index}>{header}</SortableTH>
                ))}
            </TableHead>
            <NftCollectionTableBody collectionsData={collectionsData} widths={widths} />
          </Card>
        </Wrapper>
      )}
    </>
  )
}

export default NftCollectionsTable
