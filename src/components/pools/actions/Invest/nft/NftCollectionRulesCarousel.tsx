import { useMemo, useRef } from 'react'
import styled from 'styled-components'

import chunk from 'lodash/chunk'
import { isMobile } from 'react-device-detect'

import NftEligibility from './NftEligibility'
import NftMedia from './NftMedia'
import {
  ButtonNext,
  ButtonPrev,
  Items,
  ItemsGroup,
  ItemsWrapper,
  LoadingWrapper,
  SectionTitle,
} from './Shared'
import { VerifiedNftCollection as VerifiedIcon } from '@/src/components/assets/VerifiedNftCollection'
import { Loading } from '@/src/components/common/Loading'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { ExternalLink } from '@/src/components/table/ExternalLink'
import { Chains } from '@/src/constants/chains'
import { OPENSEA_BASE_URL, QUIXOTIC_BASE_URL, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useNftCollectionLists, {
  NFTType,
  NftCollectionData,
} from '@/src/hooks/aelin/useNftCollectionLists'
import { strToKebabCase } from '@/src/utils/string'
import { formatToken } from '@/src/web3/bigNumber'

const Card = styled(BaseCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 2rem 0rem 2rem;
  background: ${({ theme: { nftWhiteList } }) => nftWhiteList.layerBackgroundColor};
  border: ${({ theme: { nftWhiteList } }) => nftWhiteList.border};
  width: 275px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`

const AllocationText = styled(Row)`
  color: ${({ theme: { colors } }) => colors.lightGray};
`
const AllocationValue = styled(Row)`
  color: ${({ theme: { colors } }) => colors.primary};
  margin: 0.5rem 1rem;
`

const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-weight: 600;
  font-size: 1.4rem;
  line-height: 1.4;
`

const CollectionRulesWrapper = styled.div<{ arrowsVisible: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    padding: 0 5rem;
  }

  overflow-x: hidden;

  max-width: -webkit-fill-available;
  max-width: -moz-available;

  &:hover ${ButtonPrev}, &:hover ${ButtonNext} {
    display: ${(props) => (props.arrowsVisible ? 'inline' : 'none')};
  }
`

type NftCollectionRulesCarouselProps = {
  pool: ParsedAelinPool
  collection: NftCollectionData
}

const RULES_PER_GROUP = 3

const NftCollectionRulesCarousel = ({ collection, pool }: NftCollectionRulesCarouselProps) => {
  const rules = pool.nftCollectionRules.find(
    (rules) => rules.collectionAddress.toLowerCase() === collection.address.toLowerCase(),
  )

  if (!rules) {
    throw new Error('CollectionRule not found.')
  }

  const { ruleAllocation, ruleText } = useMemo(() => {
    if (rules.purchaseAmountPerToken && rules.purchaseAmount.raw.gt(ZERO_BN)) {
      return {
        ruleText: 'Limited deposit amount per NFT held',
        ruleAllocation: `${formatToken(
          rules.purchaseAmount.raw,
          18,
          pool.investmentTokenDecimals,
        )} ${pool.investmentTokenSymbol}`,
      }
    }

    return {
      ruleText: 'Deposit amount',
      ruleAllocation: 'Unlimited',
    }
  }, [rules, pool])

  const imageUrl = collection?.imageUrl
  const name = collection?.name
  const isVerified = collection?.isVerified

  const marketplaceUrl = useMemo(() => {
    if (collection.network === Chains.optimism) {
      return QUIXOTIC_BASE_URL + 'collection/' + rules.collectionAddress
    }

    return OPENSEA_BASE_URL + 'collection/' + strToKebabCase(name)
  }, [rules.collectionAddress, name, collection.network])

  return (
    <Card>
      <NftMedia height={44} src={imageUrl} width={44} />
      <Row>
        <ExternalLink href={marketplaceUrl}>
          {' '}
          <Title>{name}</Title>
        </ExternalLink>
        {isVerified && <VerifiedIcon />}
      </Row>
      <AllocationText>{ruleText}:</AllocationText>
      <AllocationValue>{ruleAllocation}</AllocationValue>
      {rules.nftType === 'ERC721' && <NftEligibility rules={rules} />}
    </Card>
  )
}

const NftCollectionRules = genericSuspense(
  ({ pool }: { pool: ParsedAelinPool }) => {
    const itemsRef = useRef<HTMLInputElement>(null)
    const carouselGroup = isMobile ? 1 : RULES_PER_GROUP

    const collectionsInfo = pool.nftCollectionRules.map((rules) => ({
      collectionAddress: rules.collectionAddress,
      nftType: rules.nftType === 'ERC1155' ? NFTType.ERC1155 : NFTType.ERC721,
    }))

    const { data: collections, error } = useNftCollectionLists(collectionsInfo, true)

    if (error) {
      throw new Error('Error getting collections')
    }

    return (
      <CollectionRulesWrapper arrowsVisible={pool.nftCollectionRules.length > RULES_PER_GROUP}>
        <SectionTitle>Collections eligible to invest in this pool:</SectionTitle>
        <ItemsWrapper>
          <ButtonPrev
            left="2%"
            onClick={() => {
              itemsRef.current?.scroll({
                left: itemsRef.current.scrollLeft - 500,
                behavior: 'smooth',
              })
            }}
            top="40%"
          />
          <Items ref={itemsRef}>
            {chunk(collections, carouselGroup).map((itemsChunk, index, itemsArr) => {
              return (
                <ItemsGroup centered={itemsArr.length === 1} gapped key={index}>
                  {itemsChunk.map((collection, index) => (
                    <NftCollectionRulesCarousel collection={collection} key={index} pool={pool} />
                  ))}
                </ItemsGroup>
              )
            })}
          </Items>
          <ButtonNext
            onClick={() => {
              itemsRef.current?.scroll({
                left: itemsRef.current.scrollLeft + 500,
                behavior: 'smooth',
              })
            }}
            right="2%"
            top="40%"
          />
        </ItemsWrapper>
      </CollectionRulesWrapper>
    )
  },
  () => (
    <LoadingWrapper>
      <Loading />
      Getting Collection Rules
    </LoadingWrapper>
  ),
)

export default NftCollectionRules
