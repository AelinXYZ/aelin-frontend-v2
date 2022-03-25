import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import InfiniteScroll from 'react-infinite-scroll-component'

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
import { ChainsValues, chainsConfig, getKeyChainByValue } from '@/src/constants/chains'
import useAelinPools from '@/src/hooks/pools/useAelinPools'
import { getAmountInPool } from '@/src/utils/aelinPool'

const Home: NextPage = () => {
  const router = useRouter()
  const { data, error, hasMore, nextPage } = useAelinPools({})

  if (error) {
    throw error
  }

  const columns = '1fr 1fr 1fr 1fr 1fr 1fr 1fr'

  return (
    <LeftSidebarLayout>
      <SectionIntro
        button={{ title: 'Create pool', onClick: () => router.push('/create-pool') }}
        description="Aelin is a fully decentralized and community-based fundraising protocol. Invest in a pool to access deals brought by sponsors. Aelin does not endorse any pools, follow an investor's best practices in our docs, and do your own research."
        title="Pools"
      />
      <TableWrapper>
        <Table>
          <TableHead columns={columns}>
            <TH>Name</TH>
            <TH>Sponsor</TH>
            <TH>Network</TH>
            <TH>Amount in Pool</TH>
            <TH>Investment deadline</TH>
            <TH>Investment token</TH>
            <TH>Stage</TH>
          </TableHead>
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
            {data.map((pool) => {
              const { chainId, id, name, purchaseTokenDecimals } = pool
              return (
                <Link href={`/pool/${getKeyChainByValue(chainId)}/${id}`} key={id} passHref>
                  <Row as="a" columns={columns}>
                    <Cell>{name.slice(0, 20)}</Cell>
                    <Cell>Sponsor name</Cell>
                    <Cell>{chainsConfig[chainId as ChainsValues].name}</Cell>
                    <Cell>
                      {
                        getAmountInPool({
                          ...pool,
                          purchaseTokenDecimals: purchaseTokenDecimals || 0,
                        }).formatted
                      }
                    </Cell>
                    <Cell>Deadline</Cell>
                    <Cell>token</Cell>
                    <Cell>stage</Cell>
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
