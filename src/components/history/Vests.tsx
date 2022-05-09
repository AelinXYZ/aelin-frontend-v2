import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import InfiniteScroll from 'react-infinite-scroll-component'

import { OrderDirection, Vest_OrderBy } from '@/graphql-schema'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonPrimaryLightSm } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import {
  Cell,
  LinkCell,
  Row,
  Table,
  TableHead,
  TableWrapper,
} from '@/src/components/pureStyledComponents/common/Table'
import { ExternalLink } from '@/src/components/table/ExternalLink'
import { SortableTH } from '@/src/components/table/SortableTH'
import { getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import useAelinVests from '@/src/hooks/aelin/history/useAelinVests'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'

type Order = {
  orderBy: Vest_OrderBy
  orderDirection: OrderDirection
}

export const Vests: React.FC = ({ ...restProps }) => {
  const { address } = useWeb3Connection()
  const router = useRouter()

  const [order, setOrder] = useState<Order>({
    orderBy: Vest_OrderBy.Timestamp,
    orderDirection: OrderDirection.Desc,
  })

  const columns = {
    alignment: {
      network: 'center',
      seePool: 'right',
    },
    widths: '140px 160px 120px 1fr',
  }

  const tableHeaderCells = [
    {
      title: 'Date',
      sortKey: Vest_OrderBy.Timestamp,
    },
    {
      title: 'Amount vested',
      sortKey: Vest_OrderBy.AmountVested,
    },
    {
      title: 'Network',
      justifyContent: columns.alignment.network,
    },
  ]

  const handleSort = (sortBy: Vest_OrderBy) => {
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
    where: { userAddress: address || ZERO_ADDRESS },
    orderBy: order.orderBy,
    orderDirection: order.orderDirection,
  }

  const { data, error, hasMore, mutate, nextPage } = useAelinVests(variables)

  useEffect(() => {
    mutate()
  }, [mutate])

  if (error) {
    throw error
  }

  return (
    <TableWrapper {...restProps}>
      <Table>
        <InfiniteScroll
          dataLength={data.length}
          hasMore={hasMore}
          loader={
            <Row columns={'1fr'}>
              <Cell justifyContent="center">Loading...</Cell>
            </Row>
          }
          next={nextPage}
        >
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
            data.map((item, index) => {
              const { amountVested, id, network, timestamp } = item
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
                  <Cell light>{amountVested}</Cell>
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
            })
          )}
        </InfiniteScroll>
      </Table>
    </TableWrapper>
  )
}

export default genericSuspense(Vests)
