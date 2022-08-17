import { useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import chunk from 'lodash/chunk'
import { isMobile } from 'react-device-detect'

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
import { Search } from '@/src/components/pureStyledComponents/form/Search'
import { ExternalLink } from '@/src/components/table/ExternalLink'
import { Chains } from '@/src/constants/chains'
import { OPENSEA_BASE_URL, QUIXOTIC_BASE_URL, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useNftCollectionList, { NFTType } from '@/src/hooks/aelin/useNftCollectionList'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { ParsedNftCollectionRules } from '@/src/utils/aelinPoolUtils'
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
const SubTitle = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-weight: 400;
  font-size: 1.25rem;
  line-height: 1rem;
  padding-bottom: 1rem;
`

const Eligible = styled.div`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 1rem;
  min-height: 15px;
`

const EligibleError = styled.span`
  color: #ff7777;
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
  rules: ParsedNftCollectionRules
}

const RULES_PER_GROUP = 3

const NftCollectionRulesCarousel = ({ pool, rules }: NftCollectionRulesCarouselProps) => {
  const { appChainId } = useWeb3Connection()
  const [eligible, setEligible] = useState<boolean>()
  const [tokenId, setTokenId] = useState<string>()
  const searchRef = useRef<HTMLInputElement>(null)
  const { data: collections, error } = useNftCollectionList(
    rules.collectionAddress,
    rules.nftType === 'ERC721' ? NFTType.ERC721 : NFTType.ERC1155,
    true,
  )
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

  if (error || (collections && collections.length > 1)) {
    throw new Error('Unexpected error when fetching nft metadata')
  }

  const imageUrl = collections?.[0]?.imageUrl
  const name = collections?.[0]?.name
  const isVerified = collections?.[0]?.isVerified
  const collectionAddress = collections?.[0]?.address

  const marketplaceUrl = useMemo(() => {
    if (appChainId === Chains.optimism) {
      return QUIXOTIC_BASE_URL + 'collection/' + collectionAddress
    }

    return OPENSEA_BASE_URL + 'assets/ethereum/' + collectionAddress
  }, [collectionAddress, appChainId])

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
      {rules.nftType === 'ERC721' && (
        <>
          <Title>Verify NFT eligibility</Title>
          <SubTitle> Each ID may only be used once per pool</SubTitle>
          <Search
            onChange={(e) => {
              setTokenId(e.target.value)
              setEligible(!rules.erc721Blacklisted.includes(e.target.value))
            }}
            placeholder="Enter NFT ID..."
            ref={searchRef}
            type="number"
          />
          <Eligible>
            {tokenId && tokenId !== '' ? (
              eligible ? (
                <>
                  NFT Id <b>{tokenId}</b> is eligible to invest.
                </>
              ) : (
                <EligibleError>
                  NFT Id <b>{tokenId}</b> is <b>NOT</b> eligible to invest.
                </EligibleError>
              )
            ) : (
              <></>
            )}
          </Eligible>
        </>
      )}
    </Card>
  )
}

const NftCollectionRules = genericSuspense(
  ({ pool }: { pool: ParsedAelinPool }) => {
    const itemsRef = useRef<HTMLInputElement>(null)
    const rules = pool.nftCollectionRules

    const carouselGroup = useMemo(() => {
      if (isMobile) return 1

      return RULES_PER_GROUP
    }, [])

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
            {chunk(rules, carouselGroup).map((itemsChunk, index, itemsArr) => {
              return (
                <ItemsGroup centered={itemsArr.length === 1} key={index}>
                  {itemsChunk.map((rules, index) => (
                    <NftCollectionRulesCarousel key={index} pool={pool} rules={rules} />
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
