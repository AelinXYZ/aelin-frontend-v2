import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { getAddress } from '@ethersproject/address'
import InfiniteScroll from 'react-infinite-scroll-component'

import { OrderDirection, PoolCreated_OrderBy } from '@/graphql-schema'
import { SectionIntro } from '@/src/components/common/SectionIntro'
import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
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
import { getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import useAelinPools from '@/src/hooks/aelin/useAelinPools'
import { shortenAddr } from '@/src/web3/utils'

const Home: NextPage = () => {
  const router = useRouter()
  const { data, error, hasMore, nextPage } = useAelinPools({
    orderBy: PoolCreated_OrderBy.Timestamp,
    orderDirection: OrderDirection.Desc,
  })

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
      sortKey: 'network',
    },
    {
      title: 'Amount in Pool',
      sortKey: 'amountInPool',
    },
    {
      title: 'Investment deadline',
      sortKey: 'invesmentDeadline',
    },
    {
      title: 'Investment token',
      justifyContent: columns.alignment.investmentToken,
      sortKey: 'investmentToken',
    },
    {
      title: 'Stage',
      sortKey: 'stage',
    },
  ]

  const [sortBy, setSortBy] = useState('')

  const handleSort = (sortBy: string) => {
    setSortBy(sortBy)
  }

  console.log(data)

  return (
    <LeftSidebarLayout>
      <SectionIntro
        backgroundImage="resources/svg/bg-pools.svg"
        button={{ title: 'Create pool', onClick: () => router.push('/create-pool') }}
        description="Aelin is a fully decentralized and community-based fundraising protocol. Invest in a pool to access deals brought by sponsors. Aelin does not endorse any pools, follow an investor's best practices in our docs, and do your own research."
        title="Pools"
      />
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
                  onClick={() => handleSort(sortKey)}
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
    </LeftSidebarLayout>
  )
}

export default genericSuspense(Home)
