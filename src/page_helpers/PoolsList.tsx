import { useRouter } from 'next/router'
import { useState } from 'react'

import { getAddress } from '@ethersproject/address'
import InfiniteScroll from 'react-infinite-scroll-component'

import { OrderDirection, PoolCreated_OrderBy, PoolsCreatedQueryVariables } from '@/graphql-schema'
import {
  Cell,
  Row,
  Table,
  TableHead,
  TableWrapper,
} from '@/src/components/pureStyledComponents/common/Table'
import { genericSuspense } from '@/src/components/safeSuspense'
import { ExternalLink } from '@/src/components/table/ExternalLink'
import { NameCell } from '@/src/components/table/NameCell'
import { SortableTH } from '@/src/components/table/SortableTH'
import { ChainsValues, getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import useAelinPools from '@/src/hooks/aelin/useAelinPools'
import useAelinPoolsFilters from '@/src/hooks/aelin/useAelinPoolsFilters'
import { shortenAddr } from '@/src/web3/utils'

interface FiltersProp {
  network: ChainsValues | null
  variables: PoolsCreatedQueryVariables
}

const PoolsList = ({ filters }: { filters: FiltersProp }) => {
  const router = useRouter()
  const { data, error, hasMore, nextPage } = useAelinPools(filters.variables, filters.network)
  const { network, setNetwork, setOrderBy, setOrderDirection, setWhere, variables } =
    useAelinPoolsFilters()

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
      sortKey: 'name',
    },
    {
      title: 'Sponsor',
      sortKey: 'sponsor',
    },
    {
      title: 'Network',
      justifyContent: columns.alignment.network,
    },
    {
      title: 'Amount in Pool',
      sortKey: 'totalSupply',
    },
    {
      title: 'Investment deadline',
      sortKey: 'timestamp',
    },
    {
      title: 'Investment token',
      justifyContent: columns.alignment.investmentToken,
      sortKey: 'purchaseToken',
    },
    {
      title: 'Stage',
      sortKey: 'poolStatus',
    },
  ]

  const [sortBy, setSortBy] = useState('')

  const handleSort = (sortBy: string) => {
    setSortBy(sortBy)
  }

  //         <select
  //           defaultValue={PoolCreated_OrderBy.Timestamp}
  //           onChange={({ target }) => setOrderBy(target.value as PoolCreated_OrderBy)}
  //         >
  //           {Object.values(PoolCreated_OrderBy).map((orderBy) => (
  //             <option key={orderBy} value={orderBy}>
  //               {orderBy}
  //             </option>
  //           ))}

  //         <select
  //           defaultValue={OrderDirection.Desc}
  //           onChange={({ target }) => setOrderDirection(target.value as OrderDirection)}
  //         >
  //           {Object.values(OrderDirection).map((orderBy) => (
  //             <option key={orderBy} value={orderBy}>
  //               {orderBy}
  //             </option>
  //           ))}

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
                  console.log(sortKey)
                  setOrderBy(sortKey as PoolCreated_OrderBy)
                }}
              >
                {title}
              </SortableTH>
            ))}
          </TableHead>
          {data.map((pool) => {
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
                <Cell justifyContent={columns.alignment.network}>
                  <span title={getNetworkConfig(network).name}>
                    {getNetworkConfig(network).icon}
                  </span>
                </Cell>
                <Cell>${amountInPool.formatted}</Cell>
                <Cell>{investmentDeadline}</Cell>
                <Cell justifyContent={columns.alignment.investmentToken}>{investmentToken}</Cell>
                <Cell>{stage}</Cell>
              </Row>
            )
          })}
        </InfiniteScroll>
      </Table>
    </TableWrapper>
  )
}

export default genericSuspense(PoolsList)
