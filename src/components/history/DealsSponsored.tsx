import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import InfiniteScroll from 'react-infinite-scroll-component'

import { DealSponsored_OrderBy, OrderDirection } from '@/graphql-schema'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonPrimaryLightSm } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import {
  Cell,
  LinkCell,
  LoadingTableRow,
  Row,
  Table,
  TableBody,
  TableHead,
  TableWrapper,
} from '@/src/components/pureStyledComponents/common/Table'
import { ExternalLink } from '@/src/components/table/ExternalLink'
import { SortableTH } from '@/src/components/table/SortableTH'
import { getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import useAelinDealsSponsored from '@/src/hooks/aelin/history/useAelinDealsSponsored'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'

type Order = {
  orderBy: DealSponsored_OrderBy
  orderDirection: OrderDirection
}

export const DealsSponsored: React.FC = ({ ...restProps }) => {
  const { address } = useWeb3Connection()
  const router = useRouter()

  const [order, setOrder] = useState<Order>({
    orderBy: DealSponsored_OrderBy.Timestamp,
    orderDirection: OrderDirection.Desc,
  })

  const columns = {
    alignment: {
      network: 'center',
      seePool: 'right',
    },
    widths: '140px 140px 140px 140px 120px 120px 1fr',
  }

  const tableHeaderCells = [
    {
      title: 'Date',
      sortKey: DealSponsored_OrderBy.Timestamp,
    },
    {
      title: 'Pool Name',
      sortKey: DealSponsored_OrderBy.PoolName,
    },
    {
      title: 'Total Investment',
      sortKey: DealSponsored_OrderBy.TotalInvested,
    },
    {
      title: 'Total Accepted',
      sortKey: DealSponsored_OrderBy.TotalAccepted,
    },
    {
      title: 'Amount Earned',
      sortKey: DealSponsored_OrderBy.AmountEarned,
    },
    {
      title: 'Network',
      justifyContent: columns.alignment.network,
    },
  ]

  const handleSort = (sortBy: DealSponsored_OrderBy) => {
    if (order.orderBy === sortBy) {
      setOrder({
        orderBy: sortBy,
        orderDirection:
          order.orderDirection === OrderDirection.Asc ? OrderDirection.Desc : OrderDirection.Asc,
      })
    } else {
      setOrder({ orderBy: sortBy, orderDirection: OrderDirection.Desc })
    }
  }

  const variables = {
    where: { sponsor: address || ZERO_ADDRESS },
    orderBy: order.orderBy,
    orderDirection: order.orderDirection,
  }

  const { data, error, hasMore, mutate, nextPage } = useAelinDealsSponsored(variables)

  useEffect(() => {
    mutate()
  }, [mutate])

  if (error) {
    throw error
  }

  return (
    <InfiniteScroll
      dataLength={data.length}
      hasMore={hasMore}
      loader={<LoadingTableRow />}
      next={nextPage}
    >
      <TableWrapper {...restProps}>
        <Table>
          <TableHead columns={columns.widths}>
            {tableHeaderCells.map(({ justifyContent, sortKey, title }, index) => (
              <SortableTH
                isActive={order.orderBy === sortKey}
                justifyContent={justifyContent}
                key={index}
                onClick={() => {
                  if (sortKey) handleSort(sortKey)
                }}
              >
                {title}
              </SortableTH>
            ))}
          </TableHead>
          {!data.length ? (
            <BaseCard>No data.</BaseCard>
          ) : (
            <TableBody>
              {data.map((item, index) => {
                const {
                  amountEarned,
                  id,
                  network,
                  poolName,
                  timestamp,
                  totalAccepted,
                  totalInvested,
                } = item
                return (
                  <Row
                    columns={columns.widths}
                    hasHover
                    key={index}
                    onClick={() => {
                      router.push(`/pool/${getKeyChainByValue(network)}/${id}`)
                    }}
                  >
                    <Cell>{formatDate(timestamp, DATE_DETAILED)}</Cell>
                    <Cell light>{poolName}</Cell>
                    <Cell light>{totalInvested}</Cell>
                    <Cell light>{totalAccepted}</Cell>
                    <Cell light>{amountEarned}</Cell>
                    <Cell justifyContent={columns.alignment.network} light>
                      {getNetworkConfig(network).icon}
                    </Cell>
                    <LinkCell justifyContent={columns.alignment.seePool} light>
                      <ButtonPrimaryLightSm
                        onClick={() => {
                          router.push(`/pool/${getKeyChainByValue(network)}/${id}`)
                        }}
                      >
                        See Pool
                      </ButtonPrimaryLightSm>
                      <ExternalLink href={`https://etherscan.io/address/${id}`} />
                    </LinkCell>
                  </Row>
                )
              })}
            </TableBody>
          )}
        </Table>
      </TableWrapper>
    </InfiniteScroll>
  )
}

export default genericSuspense(DealsSponsored)
