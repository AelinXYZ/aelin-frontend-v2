import { useMemo } from 'react'
import styled from 'styled-components'

import { genericSuspense } from '../../helpers/SafeSuspense'
import { TableCard } from '../../history/common/TableWrapper'
import { BaseCard } from '../../pureStyledComponents/common/BaseCard'
import {
  Cell as BaseCell,
  HideOnDesktop as BaseHideOnDesktop,
  Row as BaseRow,
  TableBody as BaseTableBody,
  TableHead as BaseTableHead,
} from '../../pureStyledComponents/common/Table'
import { ExternalLink } from '../../table/ExternalLink'
import { SortableTH } from '../../table/SortableTH'
import { Value } from '@/src/components/pools/common/InfoCell'
import { Chains } from '@/src/constants/chains'
import { OPENSEA_BASE_URL, QUIXOTIC_BASE_URL } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useNftCollectionLists, {
  NFTType,
  NftCollectionData,
} from '@/src/hooks/aelin/useNftCollectionLists'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { ParsedNftCollectionRules } from '@/src/utils/aelinPoolUtils'
import { formatToken } from '@/src/web3/bigNumber'

const TableHead = styled(BaseTableHead)`
  margin-bottom: 0;
  padding-bottom: 0;
`

const TableBody = styled(BaseTableBody)`
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    row-gap: 0px;
  }
`

const HideOnDesktop = styled(BaseHideOnDesktop)`
  max-width: 60px;
`

const Row = styled(BaseRow)`
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    border: none;
    padding-bottom: 2px;
    padding-top: 2px;
    min-height: auto;
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

const Cell = styled(BaseCell)`
  margin-right: 15%;
  border-bottom: 1px solid ${({ theme }) => theme.infoCell.borderBottomColor};
  align-items: baseline;
`

const Card = styled(BaseCard)`
  width: 100%;
`

const Wrapper: React.FC = ({ children, ...restProps }) => (
  <TableCard style={{ padding: 0, order: 3 }} {...restProps}>
    {children}
  </TableCard>
)

type NftCollectionRulesRowProps = {
  pool: ParsedAelinPool
  rules: ParsedNftCollectionRules
  isERC1155: boolean
  widths: string
  collection?: NftCollectionData
}

const CollectionRulesRow = ({
  collection,
  isERC1155,
  pool,
  rules,
  widths,
}: NftCollectionRulesRowProps) => {
  const { appChainId } = useWeb3Connection()
  const getMarketplaceUrl = (collectionAddress: string) => {
    if (appChainId === Chains.optimism) {
      return QUIXOTIC_BASE_URL + 'collection/' + collectionAddress
    }

    return OPENSEA_BASE_URL + 'assets/ethereum/' + collectionAddress
  }

  const name = collection?.name

  const values = useMemo(() => {
    if (rules.nftType === 'ERC721') {
      const allocation = rules.purchaseAmountPerToken
        ? `${formatToken(rules.purchaseAmount.raw, 18, pool.investmentTokenDecimals)} ${
            pool.investmentTokenSymbol
          }`
        : 'Unlimited'
      return [
        {
          allocation,
        },
      ]
    }

    return rules.erc1155TokenIds.map((nftID) => ({
      nftID,
      amountNeeded: rules.erc1155TokensAmtEligible[rules.erc1155TokenIds.indexOf(nftID)],
    }))
  }, [pool, rules])

  return (
    <>
      {values.map((value, index) => (
        <Row columns={widths} key={index}>
          <Cell mobileJustifyContent="left">
            <Value>
              <ExternalLink href={getMarketplaceUrl(rules.collectionAddress)}>{name}</ExternalLink>
            </Value>
          </Cell>
          {isERC1155 && (
            <Cell mobileJustifyContent="left">
              <HideOnDesktop>ID:&nbsp;</HideOnDesktop>
              <Value>{'nftID' in value ? value.nftID : ''}</Value>
            </Cell>
          )}
          <Cell mobileJustifyContent="left">
            <HideOnDesktop>
              {isERC1155 ? 'Amount needed:' : 'Allocation per NFT:'}&nbsp;
            </HideOnDesktop>
            <Value>{'amountNeeded' in value ? value.amountNeeded : value.allocation}</Value>
          </Cell>
        </Row>
      ))}
    </>
  )
}

const CollectionRules = genericSuspense(
  ({ isERC1155, pool, widths }: Omit<NftCollectionRulesRowProps, 'rules' | 'collection'>) => {
    const collectionsInfo = pool.nftCollectionRules.map((rules) => ({
      collectionAddress: rules.collectionAddress,
      nftType: isERC1155 ? NFTType.ERC1155 : NFTType.ERC721,
    }))
    const { data: collections, error } = useNftCollectionLists(collectionsInfo, true)

    if (error) {
      throw new Error('Error getting collections')
    }

    return (
      <>
        {collections &&
          collections.length &&
          pool.nftCollectionRules.map((rules, index) => (
            <CollectionRulesRow
              collection={collections.find(
                (collection) => collection.address.toLowerCase() === rules.collectionAddress,
              )}
              isERC1155={isERC1155}
              key={index}
              pool={pool}
              rules={rules}
              widths={widths}
            />
          ))}
      </>
    )
  },
)

export const NftCollectionInformation = ({ pool }: { pool: ParsedAelinPool }) => {
  const isERC1155 = pool?.nftCollectionRules.some(
    (collectionRule) => collectionRule.nftType === 'ERC1155',
  )

  const widths = useMemo(() => {
    if (isERC1155) {
      return '230px 70px 1fr'
    }

    return '230px 230px'
  }, [isERC1155])

  const tableHeaderCells = useMemo(() => {
    if (isERC1155) {
      return ['Collections', 'ID', 'Amount needed']
    }

    return ['Collections', 'Allocation per NFT']
  }, [isERC1155])

  return (
    <Wrapper>
      <Card>
        <Title>NFT Collections</Title>
        <TableHead columns={widths}>
          {tableHeaderCells
            .filter((header) => !(header === 'ID' && !isERC1155))
            .map((header, index) => (
              <SortableTH key={index}>{header}</SortableTH>
            ))}
        </TableHead>
        <TableBody>
          <CollectionRules isERC1155={isERC1155} pool={pool} widths={widths} />
        </TableBody>
      </Card>
    </Wrapper>
  )
}

export default NftCollectionInformation
