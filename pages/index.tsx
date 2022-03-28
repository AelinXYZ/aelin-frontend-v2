import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

import InfiniteScroll from 'react-infinite-scroll-component'

import { OrderDirection, PoolCreated_OrderBy } from '@/graphql-schema'
import ENSOrAddress from '@/src/components/aelin/ENSOrAddress'
import { SectionIntro } from '@/src/components/common/SectionIntro'
import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import {
  Cell,
  Row,
  TH,
  Table,
  TableHead,
  TableWrapper,
} from '@/src/components/pureStyledComponents/common/Table'
import { genericSuspense } from '@/src/components/safeSuspense'
import { NameCell } from '@/src/components/table/NameCell'
import { getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import useAelinPools from '@/src/hooks/aelin/useAelinPools'

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
    widths: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
  }

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
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
            hasMore={hasMore}
            height={500}
            loader={<h4>Loading...</h4>}
            next={nextPage}
          >
            <TableHead columns={columns.widths}>
              <TH>Name</TH>
              <TH>Sponsor</TH>
              <TH justifyContent={columns.alignment.network}>Network</TH>
              <TH>Amount in Pool</TH>
              <TH>Investment deadline</TH>
              <TH justifyContent={columns.alignment.investmentToken}>Investment token</TH>
              <TH>Stage</TH>
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
                <Link href={`/pool/${getKeyChainByValue(network)}/${id}`} key={id} passHref>
                  <Row as="a" columns={columns.widths}>
                    <NameCell badge="3">{name.replace('aePool-', '')}</NameCell>
                    <Cell>
                      <ENSOrAddress address={sponsor} />
                    </Cell>
                    <Cell justifyContent={columns.alignment.network}>
                      <span title={getNetworkConfig(network).name}>
                        {getNetworkConfig(network).icon}
                      </span>
                    </Cell>
                    <Cell>${amountInPool.formatted}</Cell>
                    <Cell>{investmentDeadline}</Cell>
                    <Cell justifyContent={columns.alignment.investmentToken}>
                      {investmentToken}
                    </Cell>
                    <Cell>{stage}</Cell>
                  </Row>
                </Link>
              )
            })}
          </InfiniteScroll>
        </Table>
      </TableWrapper>
    </LeftSidebarLayout>
  )
}

export default genericSuspense(Home)
