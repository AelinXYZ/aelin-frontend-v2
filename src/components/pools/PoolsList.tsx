import { useRouter } from 'next/router'
import { useState } from 'react'

import { getAddress } from '@ethersproject/address'
import InfiniteScroll from 'react-infinite-scroll-component'

import { OrderDirection, PoolCreated_OrderBy, PoolsCreatedQueryVariables } from '@/graphql-schema'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import {
  Cell,
  Row,
  Table,
  TableHead,
  TableWrapper,
} from '@/src/components/pureStyledComponents/common/Table'
import { genericSuspense } from '@/src/components/safeSuspense'
import { Deadline } from '@/src/components/table/Deadline'
import { ExternalLink } from '@/src/components/table/ExternalLink'
import { NameCell } from '@/src/components/table/NameCell'
import { SortableTH } from '@/src/components/table/SortableTH'
import { Stage } from '@/src/components/table/Stage'
import { ChainsValues, getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import useAelinPools from '@/src/hooks/aelin/useAelinPools'
import { shortenAddr } from '@/src/web3/utils'

interface FiltersProp {
  network: ChainsValues | null
  variables: PoolsCreatedQueryVariables
}

const PoolsList = ({
  filters,
  setOrderBy,
  setOrderDirection,
}: {
  filters: FiltersProp
  setOrderBy: (value: PoolCreated_OrderBy | undefined) => void
  setOrderDirection: (value: OrderDirection) => void
}) => {
  const router = useRouter()
  const { data, error, hasMore, nextPage } = useAelinPools(filters.variables, filters.network)

  if (error) {
    throw error
  }

  const columns = {
    alignment: {
      investmentToken: 'center',
      network: 'center',
    },
    widths: '120px 120px 90px 1fr 1fr 165px 80px',
  }

  const tableHeaderCells = [
    {
      title: 'Name',
      sortKey: PoolCreated_OrderBy.Name,
    },
    {
      title: 'Sponsor',
      sortKey: PoolCreated_OrderBy.Sponsor,
    },
    {
      title: 'Network',
      justifyContent: columns.alignment.network,
    },
    {
      title: 'Amount in Pool',
      sortKey: PoolCreated_OrderBy.TotalSupply,
    },
    {
      title: 'Investment deadline',
      sortKey: PoolCreated_OrderBy.PurchaseExpiry,
    },
    {
      title: 'Investment token',
      justifyContent: columns.alignment.investmentToken,
      sortKey: PoolCreated_OrderBy.PurchaseToken,
    },
    {
      title: 'Stage',
      sortKey: PoolCreated_OrderBy.PoolStatus,
    },
  ]

  const [sortBy, setSortBy] = useState<string | undefined>()

  const handleSort = (sortBy: PoolCreated_OrderBy | undefined) => {
    if (sortBy === filters.variables.orderBy) {
      if (filters.variables.orderDirection === OrderDirection.Desc) {
        setOrderDirection(OrderDirection.Asc)
      } else {
        setOrderDirection(OrderDirection.Desc)
        setOrderBy(undefined)
        return setSortBy(undefined)
      }
    } else {
      setSortBy(sortBy)
      setOrderDirection(OrderDirection.Desc)
      setOrderBy(sortBy as PoolCreated_OrderBy)
    }
  }

  return (
    <TableWrapper>
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
                isActive={sortBy === sortKey}
                justifyContent={justifyContent}
                key={index}
                onClick={() => {
                  handleSort(sortKey)
                }}
              >
                {title}
              </SortableTH>
            ))}
          </TableHead>
          {!data.length ? (
            <BaseCard>No data.</BaseCard>
          ) : (
            data.map((pool) => {
              const {
                amountInPool,
                id,
                investmentDeadline,
                investmentToken,
                name,
                network,
                sponsor,
                stage,
              } = pool
              return (
                <Row
                  columns={columns.widths}
                  hasHover
                  key={id}
                  onClick={() => {
                    router.push(`/pool/${getKeyChainByValue(network)}/${id}`)
                  }}
                >
                  <NameCell badge="3">{name.replace('aePool-', '')}</NameCell>
                  <Cell>
                    <ExternalLink href={`https://etherscan.io/address/${getAddress(sponsor)}`}>
                      {shortenAddr(getAddress(sponsor))}
                    </ExternalLink>
                  </Cell>
                  <Cell
                    justifyContent={columns.alignment.network}
                    title={getNetworkConfig(network).name}
                  >
                    {getNetworkConfig(network).icon}
                  </Cell>
                  <Cell>${amountInPool.formatted}</Cell>
                  <Deadline progress="33">{investmentDeadline}</Deadline>
                  <Cell justifyContent={columns.alignment.investmentToken}>{investmentToken}</Cell>
                  <Stage stage={stage.replace(' ', '').toLowerCase()}>{stage}</Stage>
                </Row>
              )
            })
          )}
        </InfiniteScroll>
      </Table>
    </TableWrapper>
  )
}

export default genericSuspense(PoolsList)
