import { useState } from 'react'
import styled from 'styled-components'

import InfiniteScroll from 'react-infinite-scroll-component'

import { DealType, OrderDirection, PoolCreated_OrderBy } from '@/graphql-schema'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import {
  Cell,
  LinkCell,
  LoadingTableRow,
  RowLink,
  TableBody,
  TableHead,
} from '@/src/components/pureStyledComponents/common/Table'
import { ExternalLink } from '@/src/components/table/ExternalLink'
import { SortableTH } from '@/src/components/table/SortableTH'
import { getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import { PoolsVestingEndDates } from '@/src/constants/poolsVestingEndDates'
import useAelinPools from '@/src/hooks/aelin/useAelinPools'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'
import { getExplorerUrl } from '@/src/utils/getExplorerUrl'

const Name = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const List: React.FC<{
  dealType: DealType
  nameQuery?: string
}> = ({ dealType, nameQuery }) => {
  const [orderBy, setOrderBy] = useState<PoolCreated_OrderBy>(PoolCreated_OrderBy.Timestamp)
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(OrderDirection.Desc)
  const { data, error, hasMore, nextPage } = useAelinPools(
    {
      orderBy: orderBy,
      orderDirection: orderDirection,
      where: {
        dealType: dealType,
        name_contains_nocase: nameQuery,
        totalAmountEarnedByProtocol_gt: 0,
        purchaseExpiry_not: null,
      },
    },
    null,
  )

  if (error) {
    throw error
  }

  const columns = {
    alignment: {
      externalLink: 'right',
      network: 'center',
    },
    widths: '160px 80px 170px 170px 1fr 30px',
  }

  const tableHeaderCells = [
    {
      title: 'Pool name',
      sortKey: PoolCreated_OrderBy.Name,
    },
    {
      title: 'Network',
      justifyContent: columns.alignment.network,
    },
    {
      title: 'Deal token total',
    },
    {
      title: 'Protocol fee',
    },
    {
      title: 'Escrow date',
    },
  ]

  const handleSort = (newOrderBy: PoolCreated_OrderBy) => {
    if (newOrderBy === orderBy) {
      if (orderDirection === OrderDirection.Desc) {
        setOrderDirection(OrderDirection.Asc)
      } else {
        setOrderBy(PoolCreated_OrderBy.Timestamp)
        setOrderDirection(OrderDirection.Desc)
      }
    } else {
      setOrderBy(newOrderBy)
      setOrderDirection(OrderDirection.Desc)
    }
  }

  const getSortableHandler = (sortKey?: PoolCreated_OrderBy) =>
    sortKey ? () => handleSort(sortKey) : undefined

  return (
    <InfiniteScroll
      dataLength={data?.length}
      hasMore={hasMore}
      loader={<LoadingTableRow />}
      next={nextPage}
    >
      <TableHead columns={columns.widths}>
        {tableHeaderCells.map(({ justifyContent, sortKey, title }, index) => (
          <SortableTH
            isActive={orderBy === sortKey}
            justifyContent={justifyContent}
            key={index}
            onClick={getSortableHandler(sortKey)}
          >
            {title}
          </SortableTH>
        ))}
      </TableHead>
      {!data?.length ? (
        <BaseCard>{`No ${dealType === DealType.SponsorDeal ? 'pools' : 'deals'}.`}</BaseCard>
      ) : (
        <TableBody>
          {data.map((item) => {
            const {
              address: id,
              chainId: network,
              deal,
              nameFormatted,
              purchaseExpiry,
              totalAmountEarnedByProtocol,
              upfrontDeal,
            } = item

            return (
              <RowLink
                columns={columns.widths}
                href={`/pool/${getKeyChainByValue(network)}/${id}`}
                key={id}
              >
                <Cell mobileJustifyContent="center">
                  <Name>{nameFormatted}</Name>
                </Cell>
                <Cell justifyContent={columns.alignment.network} mobileJustifyContent="center">
                  {getNetworkConfig(network).icon}
                </Cell>
                <Cell mobileJustifyContent="center">
                  {deal
                    ? deal.underlyingToken.dealAmount.formatted + ' ' + deal.underlyingToken.symbol
                    : upfrontDeal
                    ? upfrontDeal.underlyingToken.dealAmount.formatted +
                      ' ' +
                      upfrontDeal.underlyingToken.symbol
                    : 'N/A'}
                </Cell>
                <Cell mobileJustifyContent="center">
                  {deal
                    ? totalAmountEarnedByProtocol.formatted + ' ' + deal.underlyingToken.symbol
                    : upfrontDeal
                    ? totalAmountEarnedByProtocol.formatted +
                      ' ' +
                      upfrontDeal.underlyingToken.symbol
                    : 'N/A'}
                </Cell>
                <Cell mobileJustifyContent="center">
                  {PoolsVestingEndDates[id]
                    ? formatDate(PoolsVestingEndDates[id], DATE_DETAILED)
                    : purchaseExpiry
                    ? formatDate(purchaseExpiry, DATE_DETAILED)
                    : 'N/A'}
                </Cell>
                <LinkCell
                  justifyContent={columns.alignment.externalLink}
                  mobileJustifyContent="center"
                >
                  <ExternalLink href={getExplorerUrl(id, network)} />
                </LinkCell>
              </RowLink>
            )
          })}
        </TableBody>
      )}
    </InfiniteScroll>
  )
}

export default List
