import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import InfiniteScroll from 'react-infinite-scroll-component'

import { Deposit_OrderBy, OrderDirection } from '@/graphql-schema'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonPrimaryLightSm } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import {
  Cell,
  HideOnMobileCell,
  LinkCell,
  LoadingTableRow,
  RowLink,
  Table,
  TableBody,
  TableHead,
  TableWrapper,
} from '@/src/components/pureStyledComponents/common/Table'
import { ExternalLink } from '@/src/components/table/ExternalLink'
import { SortableTH } from '@/src/components/table/SortableTH'
import { getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import useAelinDeposits from '@/src/hooks/aelin/history/useAelinDeposits'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'
import { shortenAddress } from '@/src/utils/string'

type Order = {
  orderBy: Deposit_OrderBy
  orderDirection: OrderDirection
}

export const Deposits: React.FC = ({ ...restProps }) => {
  const { address } = useWeb3Connection()
  const router = useRouter()

  const [order, setOrder] = useState<Order>({
    orderBy: Deposit_OrderBy.Timestamp,
    orderDirection: OrderDirection.Desc,
  })

  const columns = {
    alignment: {
      network: 'center',
      seePool: 'right',
    },
    widths: '140px 140px 120px 180px 120px 1fr',
  }

  const tableHeaderCells = [
    {
      title: 'Date',
      sortKey: Deposit_OrderBy.Timestamp,
    },
    {
      title: 'Pool name',
      sortKey: Deposit_OrderBy.PoolName,
    },
    {
      title: 'Sponsor',
      sortKey: Deposit_OrderBy.Sponsor,
    },
    {
      title: 'Amount deposited',
      sortKey: Deposit_OrderBy.AmountDeposited,
    },
    {
      title: 'Network',
      justifyContent: columns.alignment.network,
    },
  ]

  const handleSort = (sortBy: Deposit_OrderBy) => {
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

  const { data, error, hasMore, mutate, nextPage } = useAelinDeposits(variables)

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
                const { amountDeposited, id, network, poolName, sponsor, timestamp } = item
                return (
                  <RowLink
                    columns={columns.widths}
                    href={`/pool/${getKeyChainByValue(network)}/${id}`}
                    key={index}
                  >
                    <Cell mobileJustifyContent="center">
                      {formatDate(timestamp, DATE_DETAILED)}
                    </Cell>
                    <Cell light mobileJustifyContent="center">
                      {poolName}
                    </Cell>
                    <Cell light mobileJustifyContent="center">
                      {
                        <ExternalLink
                          href={`${getNetworkConfig(network).blockExplorerUrls}/address/${sponsor}`}
                        >
                          {shortenAddress(sponsor)}
                        </ExternalLink>
                      }
                    </Cell>
                    <Cell light mobileJustifyContent="center">
                      {amountDeposited}
                    </Cell>
                    <HideOnMobileCell justifyContent={columns.alignment.network} light>
                      {getNetworkConfig(network).icon}
                    </HideOnMobileCell>
                    <LinkCell flexFlowColumn justifyContent={columns.alignment.seePool} light>
                      <ButtonPrimaryLightSm
                        onClick={() => {
                          router.push(`/pool/${getKeyChainByValue(network)}/${id}`)
                        }}
                      >
                        See Pool
                      </ButtonPrimaryLightSm>
                      <ExternalLink
                        href={`${getNetworkConfig(network).blockExplorerUrls}/address/${id}`}
                      />
                    </LinkCell>
                  </RowLink>
                )
              })}
            </TableBody>
          )}
        </Table>
      </TableWrapper>
    </InfiniteScroll>
  )
}

export default genericSuspense(Deposits)
