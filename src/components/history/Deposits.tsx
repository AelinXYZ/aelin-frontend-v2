import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Deposit_OrderBy, OrderDirection } from '@/graphql-schema'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { TableCard, TableWrapper } from '@/src/components/history/common/TableWrapper'
import {
  ButtonPrimaryLight,
  ButtonPrimaryLightSm,
} from '@/src/components/pureStyledComponents/buttons/Button'
import {
  Cell,
  HideOnMobileCell,
  LinkCell,
  RowLink,
  TableBody,
} from '@/src/components/pureStyledComponents/common/Table'
import { ExternalLink } from '@/src/components/table/ExternalLink'
import { NameCell } from '@/src/components/table/NameCell'
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

export const Deposits: React.FC = () => {
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

  if (!data.length) {
    return (
      <TableWrapper
        columns={columns}
        dataLength={data.length}
        handleSort={handleSort}
        hasMore={hasMore}
        nextPage={nextPage}
        order={order}
        tableHeaderCells={tableHeaderCells}
      >
        <TableCard>
          <p>There’s no deposit history yet</p>
          <ButtonPrimaryLight
            onClick={() => {
              router.push('/')
            }}
          >
            Join a pool
          </ButtonPrimaryLight>
        </TableCard>
      </TableWrapper>
    )
  }

  return (
    <TableWrapper
      columns={columns}
      dataLength={data.length}
      handleSort={handleSort}
      hasMore={hasMore}
      nextPage={nextPage}
      order={order}
      tableHeaderCells={tableHeaderCells}
    >
      <TableBody>
        {data.map((item, index) => {
          const { amountDeposited, id, network, poolName, sponsor, timestamp } = item

          return (
            <RowLink
              columns={columns.widths}
              href={{
                pathname: '/pool',
                query: { address: id, network: getKeyChainByValue(network) },
              }}
              key={index}
            >
              <Cell mobileJustifyContent="center">{formatDate(timestamp, DATE_DETAILED)}</Cell>
              <NameCell light mobileJustifyContent="center">
                {poolName}
              </NameCell>
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
                <Link
                  href={{
                    pathname: '/pool',
                    query: { address: id, network: getKeyChainByValue(network) },
                  }}
                  passHref
                >
                  <ButtonPrimaryLightSm>See Pool</ButtonPrimaryLightSm>
                </Link>
                <ExternalLink
                  href={`${getNetworkConfig(network).blockExplorerUrls}/address/${id}`}
                />
              </LinkCell>
            </RowLink>
          )
        })}
      </TableBody>
    </TableWrapper>
  )
}

export default genericSuspense(Deposits)
