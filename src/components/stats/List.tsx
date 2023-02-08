import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import InfiniteScroll from 'react-infinite-scroll-component'

import { OrderDirection, User_OrderBy } from '@/graphql-schema'
import ENSOrAddress from '@/src/components/aelin/ENSOrAddress'
import { Investors as InvestorsIcon } from '@/src/components/assets/Investors'
import { Sponsors as SponsorsIcon } from '@/src/components/assets/Sponsors'
import { Vouchers as VouchersIcon } from '@/src/components/assets/Vouchers'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import {
  ButtonCSS,
  ButtonPrimaryLightSm,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import {
  Cell,
  HideOnDesktop,
  HideOnMobileCell,
  LinkCell,
  LoadingTableRow,
  Row,
  TableBody,
  TableHead,
} from '@/src/components/pureStyledComponents/common/Table'
import { Search as BaseSearch } from '@/src/components/pureStyledComponents/form/Search'
import { SortableTH } from '@/src/components/table/SortableTH'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import useAelinUsers from '@/src/hooks/aelin/useAelinUsers'
import { useEnsLookUpAddress } from '@/src/hooks/useEnsResolvers'

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 20px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    flex-direction: row;
  }
`
const SearchWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`
const ButtonsWrapper = styled.div`
  display: flex;
  flex: 1;
  gap: 20px;
`
const Search = styled(BaseSearch)`
  margin-bottom: 20px;
  max-width: 100%;
`

const ButtonOnCSS = css`
  background-color: ${({ theme }) => theme.buttonPrimary.backgroundColor};
  border-color: ${({ theme }) => theme.buttonPrimary.borderColor};
  color: ${({ theme }) => theme.buttonPrimary.color};

  .fill {
    fill: ${({ theme }) => theme.buttonPrimary.borderColor};
  }
`
const TabButton = styled.div<{ active?: boolean }>`
  ${ButtonCSS}
  color: ${({ theme: { colors } }) => colors.textColor};
  padding: 0 10px;
  width: 110px;
  &:hover {
    ${ButtonOnCSS}
  }
  ${({ active }) => active && ButtonOnCSS}
`

enum Section {
  SPONSORS = 'sponsors',
  VOUCHERS = 'vouchers',
  INVESTORS = 'investors',
}

enum SectionFilter {
  SPONSORS = 'poolsSponsored_not',
  VOUCHERS = 'poolsVouched_not',
  INVESTORS = 'poolsInvested_not',
}

const VoucherLinkButton = ({ id }: { id: string }) => {
  const router = useRouter()
  const { data: voucherEnsAddress, isValidating } = useEnsLookUpAddress(id)

  return (
    <ButtonPrimaryLightSm
      disabled={isValidating}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        router.push(`/?voucher=${voucherEnsAddress}`, undefined, { shallow: true })
      }}
    >
      See more
    </ButtonPrimaryLightSm>
  )
}

const List: React.FC = () => {
  const router = useRouter()
  const [sortBy, setSortBy] = useState<User_OrderBy | undefined>()
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(OrderDirection.Desc)
  const [searchString, setSearchString] = useState<string>()
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>(SectionFilter.SPONSORS)
  const [activeTab, setActiveTab] = useState<Section>(Section.SPONSORS)

  const {
    query: { section },
  } = router

  const { data, error, hasMore, nextPage } = useAelinUsers({
    orderBy: sortBy ?? User_OrderBy.PoolsSponsoredAmt,
    orderDirection,
    where: {
      id: searchString && searchString !== '' ? searchString.toLocaleLowerCase() : undefined,
      [sectionFilter]: [],
    },
  })

  if (error) {
    throw error
  }

  const columns = {
    alignment: {
      seeMore: 'right',
    },
    widths: '180px 120px 1fr 120px',
  }

  const tableHeaderCells = {
    [Section.SPONSORS]: [
      {
        title: 'Sponsor',
      },
      {
        title: 'Network',
      },
      {
        title: 'Pools created',
        sortKey: User_OrderBy.PoolsSponsoredAmt,
      },
    ],
    [Section.INVESTORS]: [
      {
        title: 'Investor',
      },
      {
        title: 'Network',
      },
      {
        title: 'Pools invested in',
        sortKey: User_OrderBy.PoolsInvestedAmt,
      },
    ],
    [Section.VOUCHERS]: [
      {
        title: 'Voucher',
      },
      {
        title: 'Network',
      },
      {
        title: 'Pools vouched',
        sortKey: User_OrderBy.PoolsSponsoredAmt,
      },
    ],
  }

  const handleSort = (sortKey?: User_OrderBy) => {
    if (!sortKey) {
      return
    }

    if (orderDirection === OrderDirection.Desc) {
      setOrderDirection(OrderDirection.Asc)
    } else {
      setOrderDirection(OrderDirection.Desc)
    }

    setSortBy(sortKey)
  }

  const handleSetSponsorsActive = () => {
    setActiveTab(Section.SPONSORS)
    setSectionFilter(SectionFilter.SPONSORS)
  }

  const handleSetInvestorsActive = () => {
    setActiveTab(Section.INVESTORS)
    setSectionFilter(SectionFilter.INVESTORS)
  }

  const handleSetVouchersActive = () => {
    setActiveTab(Section.VOUCHERS)
    setSectionFilter(SectionFilter.VOUCHERS)
  }

  useEffect(() => {
    switch (section as Section) {
      case Section.SPONSORS:
        handleSetSponsorsActive()
        break
      case Section.VOUCHERS:
        handleSetVouchersActive()
        break
      case Section.INVESTORS:
        handleSetInvestorsActive()
        break
      default:
        handleSetSponsorsActive()
    }
  }, [section, setSectionFilter])

  return (
    <>
      <HeaderWrapper>
        <ButtonsWrapper>
          <TabButton active={activeTab === Section.SPONSORS} onClick={handleSetSponsorsActive}>
            <SponsorsIcon />
            Sponsors
          </TabButton>
          <TabButton active={activeTab === Section.INVESTORS} onClick={handleSetInvestorsActive}>
            <InvestorsIcon />
            Investors
          </TabButton>
          <TabButton active={activeTab === Section.VOUCHERS} onClick={handleSetVouchersActive}>
            <VouchersIcon />
            Vouchers
          </TabButton>
        </ButtonsWrapper>
        <SearchWrapper>
          <Search
            onChange={async (evt) => {
              setSearchString(evt.target.value)
            }}
            placeholder={`Enter ${activeTab.slice(0, -1)} address...`}
          />
        </SearchWrapper>
      </HeaderWrapper>
      <InfiniteScroll
        dataLength={data?.length}
        hasMore={hasMore}
        loader={<LoadingTableRow />}
        next={nextPage}
      >
        <TableHead columns={columns.widths}>
          {tableHeaderCells[activeTab].map(({ sortKey, title }, index) => (
            <SortableTH
              isActive={sortBy === sortKey}
              key={index}
              onClick={
                sortKey
                  ? () => {
                      handleSort(sortKey)
                    }
                  : undefined
              }
            >
              {title}
            </SortableTH>
          ))}
        </TableHead>
        {!data?.length ? (
          <BaseCard>No {activeTab}.</BaseCard>
        ) : (
          <TableBody>
            {data.map((item, index) => {
              const {
                chainId: network,
                id,
                poolsInvestedAmt,
                poolsSponsoredAmt,
                poolsVouchedAmt,
              } = item

              return (
                <Row columns={columns.widths} key={index}>
                  <Cell mobileJustifyContent="center">
                    <ENSOrAddress
                      address={id}
                      light
                      mobileJustifyContent="center"
                      network={network as ChainsValues}
                    />
                  </Cell>
                  <HideOnMobileCell title={getNetworkConfig(network).shortName}>
                    {getNetworkConfig(network).icon}
                  </HideOnMobileCell>
                  <Cell mobileJustifyContent="center">
                    <HideOnDesktop>{tableHeaderCells[activeTab][2].title}:&nbsp;</HideOnDesktop>
                    {activeTab === Section.INVESTORS
                      ? poolsInvestedAmt
                      : activeTab === Section.VOUCHERS
                      ? poolsVouchedAmt
                      : poolsSponsoredAmt}
                  </Cell>
                  {activeTab !== Section.INVESTORS && (
                    <LinkCell
                      justifyContent={columns.alignment.seeMore}
                      mobileJustifyContent="center"
                    >
                      {activeTab === Section.VOUCHERS ? (
                        <VoucherLinkButton id={id} />
                      ) : (
                        <ButtonPrimaryLightSm
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            router.push(activeTab === Section.SPONSORS ? `/?filter=${id}` : '#')
                          }}
                        >
                          See more
                        </ButtonPrimaryLightSm>
                      )}
                    </LinkCell>
                  )}
                </Row>
              )
            })}
          </TableBody>
        )}
      </InfiniteScroll>
    </>
  )
}

export default genericSuspense(List)
