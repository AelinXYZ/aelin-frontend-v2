import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import InfiniteScroll from 'react-infinite-scroll-component'

import ENSOrAddress from '@/src/components/aelin/ENSOrAddress'
import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { LinkButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { genericSuspense } from '@/src/components/safeSuspense'
import { getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import useAelinPools from '@/src/hooks/aelin/useAelinPools'

const PoolRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Home: NextPage = () => {
  const router = useRouter()
  const { data, error, hasMore, nextPage } = useAelinPools({})

  if (error) {
    throw error
  }

  return (
    <LeftSidebarLayout>
      <LinkButton href="/pool/create" passHref>
        <a>Create Pool</a>
      </LinkButton>
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
        {!data
          ? 'Loading...'
          : data.map((pool) => {
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
                <PoolRow
                  key={id}
                  onClick={() => router.push(`/pool/${getKeyChainByValue(network)}/${id}`)}
                >
                  {/*Pool name */}
                  <span>{name}</span>

                  {/* Sponsor name */}
                  <ENSOrAddress address={sponsor} />

                  {/* Network Logo */}
                  <span title={getNetworkConfig(network).name}>
                    {getNetworkConfig(network).icon}
                  </span>

                  {/* Amount in pool */}
                  <span>${amountInPool.formatted}</span>

                  {/* Investment deadLine */}
                  <span>{investmentDeadline}</span>

                  {/* Investment token */}
                  <span>{investmentToken}</span>

                  {/* poolStage */}
                  <span>{stage}</span>
                </PoolRow>
              )
            })}
      </InfiniteScroll>
    </LeftSidebarLayout>
  )
}

export default genericSuspense(Home)
