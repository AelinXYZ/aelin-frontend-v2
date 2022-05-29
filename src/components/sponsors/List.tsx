import { useRouter } from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'

import InfiniteScroll from 'react-infinite-scroll-component'

import { OrderDirection, User_OrderBy } from '@/graphql-schema'
import { ENSOrAddress } from '@/src/components/aelin/ENSOrAddress'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonPrimaryLightSm } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import {
  Cell,
  HideOnDesktop,
  HideOnMobileCell,
  LinkCell,
  LoadingTableRow,
  RowLink,
  TableBody,
  TableHead,
} from '@/src/components/pureStyledComponents/common/Table'
import { Search as BaseSearch } from '@/src/components/pureStyledComponents/form/Search'
import { SortableTH } from '@/src/components/table/SortableTH'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import useAelinUsers from '@/src/hooks/aelin/useAelinUsers'

const Search = styled(BaseSearch)`
  margin-bottom: 20px;
  max-width: 100%;
  width: 560px;
`

export const List: React.FC = () => {
  const router = useRouter()
  const [sortBy, setSortBy] = useState<User_OrderBy | undefined>()
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(OrderDirection.Desc)
  const [searchString, setSearchString] = useState<string>()

  const { data, error, hasMore, nextPage } = useAelinUsers({
    orderBy: sortBy ?? User_OrderBy.PoolsSponsoredAmt,
    orderDirection,
    where: {
      id: searchString && searchString !== '' ? searchString.toLocaleLowerCase() : undefined,
      poolsSponsored_not: [],
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

  const tableHeaderCells = [
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
  ]

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

  return (
    <>
      <Search
        onChange={async (evt) => {
          setSearchString(evt.target.value)
        }}
        placeholder="Enter sponsor address..."
      />
      <InfiniteScroll
        dataLength={data?.length}
        hasMore={hasMore}
        loader={<LoadingTableRow />}
        next={nextPage}
      >
        <TableHead columns={columns.widths}>
          {tableHeaderCells.map(({ sortKey, title }, index) => (
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
          <BaseCard>No sponsors.</BaseCard>
        ) : (
          <TableBody>
            {data.map((item, index) => {
              const { chainId: network, id, poolsSponsoredAmt } = item
              return (
                <RowLink columns={columns.widths} href={`/`} key={index}>
                  <ENSOrAddress
                    address={id}
                    light
                    mobileJustifyContent="center"
                    network={network as ChainsValues}
                  />
                  <HideOnMobileCell title={getNetworkConfig(network).name}>
                    {getNetworkConfig(network).icon}
                  </HideOnMobileCell>
                  <Cell mobileJustifyContent="center">
                    <HideOnDesktop>Deals created:&nbsp;</HideOnDesktop>
                    {poolsSponsoredAmt}
                  </Cell>
                  <LinkCell
                    justifyContent={columns.alignment.seeMore}
                    mobileJustifyContent="center"
                  >
                    <ButtonPrimaryLightSm
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        router.push(`/`)
                      }}
                    >
                      See more
                    </ButtonPrimaryLightSm>
                  </LinkCell>
                </RowLink>
              )
            })}
          </TableBody>
        )}
      </InfiniteScroll>
    </>
  )
}

export default genericSuspense(List)
