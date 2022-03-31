import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'

import { getAddress } from '@ethersproject/address'
import InfiniteScroll from 'react-infinite-scroll-component'

import { OrderDirection, PoolCreated_OrderBy } from '@/graphql-schema'
import { SectionIntro } from '@/src/components/common/SectionIntro'
import { Dropdown, DropdownItem, DropdownPosition } from '@/src/components/dropdown/Dropdown'
import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { ButtonDropdown } from '@/src/components/pureStyledComponents/buttons/Button'
import {
  Cell,
  Row,
  Table,
  TableHead,
  TableWrapper,
} from '@/src/components/pureStyledComponents/common/Table'
import { Search } from '@/src/components/pureStyledComponents/form/Search'
import { genericSuspense } from '@/src/components/safeSuspense'
import { ExternalLink } from '@/src/components/table/ExternalLink'
import { NameCell } from '@/src/components/table/NameCell'
import { SortableTH } from '@/src/components/table/SortableTH'
import { getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import useAelinPools from '@/src/hooks/aelin/useAelinPools'
import { shortenAddr } from '@/src/web3/utils'

const Filters = styled.div`
  --gap: 20px;

  display: grid;
  gap: var(--gap);
  margin-bottom: 20px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    grid-template-columns: 1fr 1fr;
  }
`

const FiltersDropdowns = styled.div`
  display: grid;
  gap: var(--gap);

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

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

  const [poolFilter, setPoolFilter] = useState('')
  const [networkFilter, setNetworkFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const mockedPools = ['All pools', 'pool 1', 'pool 2', 'pool 3']
  const mockedNetworks = ['All networks', 'Ethereum', 'Optimism', 'Avalanche']
  const mockedStates = ['All pools', 'Open', 'Awaiting deal', 'Deal ready', 'Vesting']

  const getCurrentItem = (index: number) => (index < 0 ? 0 : index)

  return (
    <LeftSidebarLayout>
      <SectionIntro
        backgroundImage="resources/svg/bg-pools.svg"
        button={{ title: 'Create pool', onClick: () => router.push('/create-pool') }}
        description="Aelin is a fully decentralized and community-based fundraising protocol. Invest in a pool to access deals brought by sponsors. Aelin does not endorse any pools, follow an investor's best practices in our docs, and do your own research."
        title="Pools"
      />
      <Filters>
        <Search placeholder="Pool name, sponsor, currency..." />
        <FiltersDropdowns>
          <Dropdown
            currentItem={getCurrentItem(mockedPools.indexOf(poolFilter))}
            dropdownButtonContent={
              <ButtonDropdown>{poolFilter ? poolFilter : mockedPools[0]}</ButtonDropdown>
            }
            items={mockedPools.map((item, key) => (
              <DropdownItem key={key} onClick={() => setPoolFilter(item)}>
                {item}
              </DropdownItem>
            ))}
          />
          <Dropdown
            currentItem={getCurrentItem(mockedNetworks.indexOf(networkFilter))}
            dropdownButtonContent={
              <ButtonDropdown>{networkFilter ? networkFilter : mockedNetworks[0]}</ButtonDropdown>
            }
            items={mockedNetworks.map((item, key) => (
              <DropdownItem key={key} onClick={() => setNetworkFilter(item)}>
                {item}
              </DropdownItem>
            ))}
          />
          <Dropdown
            currentItem={getCurrentItem(mockedStates.indexOf(stateFilter))}
            dropdownButtonContent={
              <ButtonDropdown>{stateFilter ? stateFilter : mockedStates[0]}</ButtonDropdown>
            }
            dropdownPosition={DropdownPosition.right}
            items={mockedStates.map((item, key) => (
              <DropdownItem key={key} onClick={() => setStateFilter(item)}>
                {item}
              </DropdownItem>
            ))}
          />
        </FiltersDropdowns>
      </Filters>
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
