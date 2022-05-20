import React from 'react'
import styled from 'styled-components'

import { Filters } from '../pureStyledComponents/common/Filters'
import { PoolCreated } from '@/graphql-schema'
import { TabButton } from '@/src/components/pureStyledComponents/buttons/Button'
import CollapsibleBlock from '@/src/components/sidebar/CollapsibleBlock'
import Pool from '@/src/components/sidebar/Pool'
import { ChainsValues, getKeyChainByValue } from '@/src/constants/chains'
import { ParsedNotification } from '@/src/hooks/aelin/useAelinNotifications'
import { getParsedPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinUser, { ParsedUser } from '@/src/hooks/aelin/useAelinUser'
import { RequiredConnection } from '@/src/hooks/requiredConnection'
import { MyPoolsFilter, useLayoutStatus } from '@/src/providers/layoutStatusProvider'
import { useNotifications } from '@/src/providers/notificationsProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div`
  box-sizing: border-box;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gray};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  display: flex;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 0 20px;
  justify-content: center;
  text-align: center;
  text-decoration: none;
  width: 100%;
`

const MoreButton = styled(TabButton)`
  border-color: ${({ theme: { colors } }) => colors.textColor};
  color: ${({ theme: { colors } }) => colors.textColor};
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px 0 0 0;
`

type PoolData = {
  stage: string
  href: string
  name: string
  notifications: number
}

function getVisiblePools(
  user: ParsedUser | undefined,
  notifications: ParsedNotification[],
  filter: MyPoolsFilter,
  isExpanded: boolean,
  appChainId: ChainsValues,
): PoolData[] {
  let visiblePools = getPools(user, filter)

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

function getPools(user: ParsedUser | undefined, filter: MyPoolsFilter): PoolCreated[] {
  if (!user) {
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
      return "You haven't invested in any pools yet, join one now"
    case MyPoolsFilter.Sponsored:
      return "You haven't sponsored any pool yet, create one now"
    case MyPoolsFilter.Funded:
      return "You haven't funded any pool yet"
  }
}

const MyPools: React.FC = ({ ...restProps }) => {
  const { address: userAddress, appChainId } = useWeb3Connection()
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

  return (
    <CollapsibleBlock title={'My pools'} {...restProps}>
      <Filters justifyContent="space-between">
        <TabButton
          isActive={activeFilter === MyPoolsFilter.Invested}
          onClick={() => {
            setActiveFilter(MyPoolsFilter.Invested)
          }}
        >
          {`Invested (${getPools(userResponse, MyPoolsFilter.Invested).length})`}
        </TabButton>
        <TabButton
          isActive={activeFilter === MyPoolsFilter.Sponsored}
          onClick={() => {
            setActiveFilter(MyPoolsFilter.Sponsored)
          }}
        >
          {`Sponsored (${getPools(userResponse, MyPoolsFilter.Sponsored).length})`}
        </TabButton>
        <TabButton
          isActive={activeFilter === MyPoolsFilter.Funded}
          onClick={() => {
            setActiveFilter(MyPoolsFilter.Funded)
          }}
        >
          {`Funded (${getPools(userResponse, MyPoolsFilter.Funded).length})`}
        </TabButton>
      </Filters>
      <RequiredConnection text={`You must be logged to see the pools you ${activeFilter} in`}>
        <>
          {getPools(userResponse, activeFilter).length > 0 ? (
            getVisiblePools(
              userResponse,
              notifications,
              activeFilter,
              filtersExpansion[activeFilter],
              appChainId,
            ).map(({ href, name, notifications, stage }, index) => (
              <Pool href={href} key={index} notifications={notifications} stage={stage}>
                {name}
              </Pool>
            ))
          ) : (
            <Wrapper>
              <Text>{getEmptyPoolsText(activeFilter)}</Text>
            </Wrapper>
          )}
          {getPools(userResponse, activeFilter).length > 3 && (
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
