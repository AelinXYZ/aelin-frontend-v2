import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { OrderDirection, Vest_OrderBy } from '@/graphql-schema'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { TableCard, TableWrapper, Text } from '@/src/components/history/common/TableWrapper'
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
import useAelinVests from '@/src/hooks/aelin/history/useAelinVests'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'

type Order = {
  orderBy: Vest_OrderBy
  orderDirection: OrderDirection
}

export const Vests: React.FC = () => {
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
    widths: '140px 140px 160px 120px 1fr',
  }

  const tableHeaderCells = [
    {
      title: 'Date',
      sortKey: Vest_OrderBy.Timestamp,
    },
    {
      title: 'Pool name',
      sortKey: Vest_OrderBy.PoolName,
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
          <Text>There’s no vest history yet</Text>
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
          const { amountVested, id, network, poolName, timestamp } = item
          return (
            <RowLink
              columns={columns.widths}
              href={`/pool/${getKeyChainByValue(network)}/${id}`}
              key={index}
            >
              <NameCell light>{poolName}</NameCell>
              <Cell mobileJustifyContent="center">{formatDate(timestamp, DATE_DETAILED)}</Cell>
              <Cell light mobileJustifyContent="center">
                {amountVested}
              </Cell>
              <HideOnMobileCell justifyContent={columns.alignment.network} light>
                {getNetworkConfig(network).icon}
              </HideOnMobileCell>
              <LinkCell flexFlowColumn justifyContent={columns.alignment.seePool} light>
                <ButtonPrimaryLightSm
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    router.push(`/pool/${getKeyChainByValue(network)}/${id}`)
                  }}
                >
                  See Pool
                </ButtonPrimaryLightSm>
                <ExternalLink href={`https://etherscan.io/address/${id}`} />
              </LinkCell>
            </RowLink>
          )
        })}
      </TableBody>
    </TableWrapper>
  )
}

export default genericSuspense(Vests)
