import { useRouter } from 'next/router'
import styled from 'styled-components'

import InfiniteScroll from 'react-infinite-scroll-component'

import { PoolsCreatedQueryVariables } from '@/graphql-schema'
import ENSOrAddress from '@/src/components/aelin/ENSOrAddress'
import { genericSuspense } from '@/src/components/safeSuspense'
import { ChainsValues, getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import useAelinPools from '@/src/hooks/aelin/useAelinPools'

interface FiltersProp {
  variables: PoolsCreatedQueryVariables
  network: ChainsValues | null
}

const PoolRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const PoolsList = ({ filters }: { filters: FiltersProp }) => {
  const router = useRouter()

  const { data, error, hasMore, nextPage } = useAelinPools(filters.variables, filters.network)

  if (error) {
    throw error
  }
  return (
    <InfiniteScroll
      dataLength={data.length}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
      hasMore={hasMore}
      height={400}
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
              <PoolRow key={id}>
                {/*Pool name */}
                <span>{name}</span>

                {/* Sponsor name */}
                <ENSOrAddress address={sponsor} />

                {/* Network Logo */}
                <span title={getNetworkConfig(network).name}>{getNetworkConfig(network).icon}</span>

                {/* Amount in pool */}
                <span>${amountInPool.formatted}</span>

                {/* Investment deadLine */}
                <span>{investmentDeadline}</span>

                {/* Investment token */}
                <span>{investmentToken}</span>

                {/* poolStage */}
                <span>{stage}</span>

                {/* view pool btn */}
                <button onClick={() => router.push(`/pool/${getKeyChainByValue(network)}/${id}`)}>
                  View
                </button>
              </PoolRow>
            )
          })}
    </InfiniteScroll>
  )
}

export default genericSuspense(PoolsList)
