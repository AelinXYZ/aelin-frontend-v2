import React from 'react'
import styled from 'styled-components'

import { PoolCreated } from '@/graphql-schema'
import CollapsibleBlock from '@/src/components/common/CollapsibleBlock'
import { TabButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { Filters } from '@/src/components/pureStyledComponents/common/Filters'
import { Pool } from '@/src/components/sidebar/Pool'
import { ChainsValues, getKeyChainByValue } from '@/src/constants/chains'
import { ParsedNotification } from '@/src/hooks/aelin/useAelinNotifications'
import { getParsedPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinUser, { ParsedUser } from '@/src/hooks/aelin/useAelinUser'
import { RequiredConnection } from '@/src/hooks/requiredConnection'
import { MyPoolsFilter, useLayoutStatus } from '@/src/providers/layoutStatusProvider'
import { useNotifications } from '@/src/providers/notificationsProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Pools = styled.div`
  display: grid;
  max-height: 300px;
  overflow: auto;
  row-gap: 10px;
`

const EmptyPools = styled.div`
  align-items: center;
  background-color: ${({ theme: { myPool } }) => myPool.backgroundColor};
  border-radius: 8px;
  border: 1px solid ${({ theme: { myPool } }) => myPool.borderColor};
  box-sizing: border-box;
  color: ${({ theme: { myPool } }) => myPool.color};
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  font-size: 1.2rem;
  font-weight: 500;
  justify-content: center;
  white-space: normal;
  padding: 12px;
  text-align: center;
`

const MoreButton = styled(TabButton)`
  border-color: ${({ theme: { buttonPrimaryLighter } }) => buttonPrimaryLighter.borderColor};
  color: ${({ theme: { buttonPrimaryLighter } }) => buttonPrimaryLighter.color};
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 0 0 0;
`

const PoolName = styled.span`
  width: 100%;
  overflow: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
`

type PoolData = {
  stage: string
  href: string
  name: string
  notifications: number
}

function getVisiblePools(
  user: ParsedUser | undefined,
  isConnected: boolean,
  notifications: ParsedNotification[],
  filter: MyPoolsFilter,
  isExpanded: boolean,
  appChainId: ChainsValues,
): PoolData[] {
  let visiblePools = getPools(user, isConnected, filter)

  if (!isExpanded) {
    visiblePools = visiblePools.slice(0, 3)
  }

  return visiblePools
    .map((pool) =>
      getParsedPool({
        chainId: appChainId,
        pool,
        poolAddress: pool.id,
        purchaseTokenDecimals: pool?.purchaseTokenDecimals as number,
      }),
    )
    .map((pool) => ({
      stage: pool.stage,
      href: `/pool/${getKeyChainByValue(pool.chainId)}/${pool.address}`,
      name: pool.nameFormatted,
      notifications: notifications.filter(
        (notification) => notification.poolAddress === pool.address,
      ).length,
    }))
}

function getPools(
  user: ParsedUser | undefined,
  isConnected: boolean,
  filter: MyPoolsFilter,
): PoolCreated[] {
  if (!user || !isConnected) {
    return []
  }

  switch (filter) {
    case MyPoolsFilter.Invested:
      return user.poolsInvested
    case MyPoolsFilter.Sponsored:
      return user.poolsSponsored
    case MyPoolsFilter.Funded:
      return user.poolsAsHolder
  }
}

function getEmptyPoolsText(filter: MyPoolsFilter): string {
  switch (filter) {
    case MyPoolsFilter.Invested:
      return "You haven't invested in a pool yet, join one now"
    case MyPoolsFilter.Sponsored:
      return "You haven't sponsored a pool yet, create one now"
    case MyPoolsFilter.Funded:
      return "You haven't funded a pool yet"
  }
}

const MyPools: React.FC = ({ ...restProps }) => {
  const { address: userAddress, appChainId, isWalletConnected } = useWeb3Connection()
  const { data: userResponse, error: errorUser } = useAelinUser(userAddress)
  const {
    sidebar: {
      myPools: { activeFilter, filtersExpansion, setActiveFilter, setFiltersExpansion },
    },
  } = useLayoutStatus()

  if (errorUser) {
    throw errorUser
  }
  const { notifications } = useNotifications()

  const isConnected = isWalletConnected && !!userAddress

  return (
    <CollapsibleBlock name="mypools" title={'My pools'} {...restProps}>
      <Filters justifyContent="space-between">
        <TabButton
          isActive={activeFilter === MyPoolsFilter.Invested}
          onClick={() => {
            setActiveFilter(MyPoolsFilter.Invested)
          }}
        >
          {`Invested (${getPools(userResponse, isConnected, MyPoolsFilter.Invested).length})`}
        </TabButton>
        <TabButton
          isActive={activeFilter === MyPoolsFilter.Sponsored}
          onClick={() => {
            setActiveFilter(MyPoolsFilter.Sponsored)
          }}
        >
          {`Sponsored (${getPools(userResponse, isConnected, MyPoolsFilter.Sponsored).length})`}
        </TabButton>
        <TabButton
          isActive={activeFilter === MyPoolsFilter.Funded}
          onClick={() => {
            setActiveFilter(MyPoolsFilter.Funded)
          }}
        >
          {`Funded (${getPools(userResponse, isConnected, MyPoolsFilter.Funded).length})`}
        </TabButton>
      </Filters>
      <RequiredConnection
        isNotConnectedText={`You must be logged to see the pools you ${activeFilter} in`}
      >
        <>
          <Pools>
            {getPools(userResponse, isConnected, activeFilter).length > 0 ? (
              getVisiblePools(
                userResponse,
                isConnected,
                notifications,
                activeFilter,
                filtersExpansion[activeFilter],
                appChainId,
              ).map(({ href, name, notifications, stage }, index) => (
                <Pool href={href} key={index} notifications={notifications} stage={stage}>
                  <PoolName>{name}</PoolName>
                </Pool>
              ))
            ) : (
              <EmptyPools>{getEmptyPoolsText(activeFilter)}</EmptyPools>
            )}
          </Pools>
          {getPools(userResponse, isConnected, activeFilter).length > 3 && (
            <ButtonContainer>
              <MoreButton
                onClick={() => {
                  setFiltersExpansion((prevFiltersExpansion) => ({
                    ...prevFiltersExpansion,
                    [activeFilter]: !prevFiltersExpansion[activeFilter],
                  }))
                }}
              >
                {filtersExpansion[activeFilter] ? 'See less' : 'See more'}
              </MoreButton>
            </ButtonContainer>
          )}
        </>
      </RequiredConnection>
    </CollapsibleBlock>
  )
}

export default MyPools
