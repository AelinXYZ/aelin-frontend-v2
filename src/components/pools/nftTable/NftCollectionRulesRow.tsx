import { useMemo } from 'react'
import styled from 'styled-components'

import { AllocationErc1155 } from './NftCollectionsTable'
import {
  Cell as BaseCell,
  HideOnDesktop as BaseHideOnDesktop,
  Row as BaseRow,
} from '../../pureStyledComponents/common/Table'
import { ExternalLink } from '../../table/ExternalLink'
import NftMedia from '../actions/Invest/nft/NftMedia'
import { Value } from '../common/InfoCell'
import { Chains } from '@/src/constants/chains'
import { OPEN_SEA_BASE_URL, QUIXOTIC_BASE_URL, STRATOS_BASE_URL } from '@/src/constants/misc'
import { NFTType, NftCollectionData } from '@/src/hooks/aelin/useNftCollectionLists'

const HideOnDesktop = styled(BaseHideOnDesktop)`
  max-width: 60px;
`
const Cell = styled(BaseCell)`
  margin-right: 15%;
  align-items: baseline;
  padding-bottom: 5px;
  border-bottom: 1px solid ${({ theme }) => theme.infoCell.borderBottomColor};
`
const LogoCell = styled(Cell)`
  margin: 0;
  border: none;
`

export const Row = styled(BaseRow)`
  background-color: inherit;

  & ${Cell}:last-child {
    border: none;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    border: none;
    padding-bottom: 3px;
    padding-top: 3px;
    min-height: auto;

    & ${Cell}:last-child {
      border-bottom: 1px solid ${({ theme }) => theme.infoCell.borderBottomColor};
    }
  }
`

export interface CollectionRulesData {
  investmentTokenDecimals: number
  investmentTokenSymbol: string
  collectionAddress: string
  nftType: NFTType
  allocationErc721: string
  allocationsErc1155: AllocationErc1155[]
}

interface NftCollectionRulesRowProps {
  rules: CollectionRulesData
  isERC1155: boolean
  widths: string
  collection?: NftCollectionData
}

const CollectionRulesRow = ({
  collection,
  isERC1155,
  rules,
  widths,
}: NftCollectionRulesRowProps) => {
  const name = collection?.name
  const slug = collection?.slug
  const imageUrl = collection?.imageUrl
  const collectionNetwork = collection?.network

  const getMarketplaceUrl = (collectionAddress: string) => {
    if (collectionNetwork === Chains.optimism) {
      return QUIXOTIC_BASE_URL + 'collection/' + collectionAddress
    }

    if (collectionNetwork === Chains.arbitrum) {
      return STRATOS_BASE_URL + 'collection/' + collectionAddress
    }

    return OPEN_SEA_BASE_URL + 'collection/' + slug
  }

  const values = useMemo(() => {
    if (rules.nftType === NFTType.ERC721) {
      return [
        {
          allocation: rules.allocationErc721,
        },
      ]
    }

    return rules.allocationsErc1155
  }, [rules])

  return (
    <>
      {values.map((value, index) => (
        <Row columns={widths} key={index}>
          <LogoCell mobileJustifyContent="left">
            <NftMedia height={25} src={imageUrl} width={25} />
          </LogoCell>
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

export default CollectionRulesRow
