import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import InfiniteScroll from 'react-infinite-scroll-component'

import { OrderDirection, PoolCreated_OrderBy, PoolsCreatedQueryVariables } from '@/graphql-schema'
import ENSOrAddress from '@/src/components/aelin/ENSOrAddress'
import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { LinkButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { genericSuspense } from '@/src/components/safeSuspense'
import {
  ChainsValues,
  getChainsByEnvironmentArray,
  getKeyChainByValue,
  getNetworkConfig,
} from '@/src/constants/chains'
import useAelinPools from '@/src/hooks/aelin/useAelinPools'
import useAelinPoolsFilters from '@/src/hooks/aelin/useAelinPoolsFilters'

const PoolRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const FiltersRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

interface FiltersProp {
  variables: PoolsCreatedQueryVariables
  network: ChainsValues | null
}

const PoolList = ({ filters }: { filters: FiltersProp }) => {
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
                <span title={getNetworkConfig(network).name}>{getNetworkConfig(network).icon}</span>

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
  )
}

const PoolListWithSuspense = genericSuspense(PoolList)

const Home: NextPage = () => {
  const { network, setNetwork, setOrderBy, setOrderDirection, setWhere, variables } =
    useAelinPoolsFilters()

  return (
    <LeftSidebarLayout>
      <LinkButton href="/pool/create" passHref>
        <a>Create Pool</a>
      </LinkButton>
      <br />
      <FiltersRow>
        <div>
          Sponsor:
          <input
            onChange={(evt) => {
              const { value } = evt.target
              if (value.length > 3)
                setWhere({
                  sponsor_contains: evt.target.value,
                })
              if (!value)
                setWhere({
                  sponsor_contains: null,
                })
            }}
            type="text"
          />
        </div>
        <div>
          Pool name:
          <input
            onChange={(evt) => {
              const { value } = evt.target
              if (value.length > 3)
                setWhere({
                  name_contains: evt.target.value,
                })
              if (!value)
                setWhere({
                  name_contains: null,
                })
            }}
            type="text"
          />
        </div>
        <div>
          Currency:
          <input
            onChange={(evt) => {
              const { value } = evt.target
              if (value.length > 2)
                setWhere({
                  purchaseTokenSymbol_contains: value,
                })
              if (!value)
                setWhere({
                  purchaseTokenSymbol_contains: null,
                })
            }}
            type="text"
          />
        </div>

        <div>
          Network:
          <select
            defaultValue={undefined}
            onChange={({ target }) => setNetwork(Number(target.value) as ChainsValues)}
          >
            <option value={undefined}>All pools</option>
            {getChainsByEnvironmentArray().map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          OrderBy:
          <select
            defaultValue={PoolCreated_OrderBy.Timestamp}
            onChange={({ target }) => setOrderBy(target.value as PoolCreated_OrderBy)}
          >
            {Object.values(PoolCreated_OrderBy).map((orderBy) => (
              <option key={orderBy} value={orderBy}>
                {orderBy}
              </option>
            ))}
          </select>
        </div>
        <div>
          OrderDirection:
          <select
            defaultValue={OrderDirection.Desc}
            onChange={({ target }) => setOrderDirection(target.value as OrderDirection)}
          >
            {Object.values(OrderDirection).map((orderBy) => (
              <option key={orderBy} value={orderBy}>
                {orderBy}
              </option>
            ))}
          </select>
        </div>
      </FiltersRow>
      <PoolListWithSuspense filters={{ variables, network }} />
    </LeftSidebarLayout>
  )
}

export default genericSuspense(Home)
