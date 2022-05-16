import React, { useState } from 'react'
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
import { useNotifications } from '@/src/providers/notificationsProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { calculateStatus } from '@/src/utils/calculatePoolStatus'

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

enum Filter {
  Invested = 'Invested',
  Sponsored = 'Sponsored',
  Funded = 'Funded',
}

function getVisiblePools(
  user: ParsedUser | undefined,
  notifications: ParsedNotification[],
  filter: Filter,
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

function getPools(user: ParsedUser | undefined, filter: Filter): PoolCreated[] {
  if (!user) {
    return []
  }

  switch (filter) {
    case Filter.Invested:
      return user.poolsInvested
    case Filter.Sponsored:
      return user.poolsSponsored
    case Filter.Funded:
      return user.poolsAsHolder
  }
}

function getEmptyPoolsText(filter: Filter): string {
  switch (filter) {
    case Filter.Invested:
      return "You haven't invested in any pools yet, join one now"
    case Filter.Sponsored:
      return "You haven't sponsored any pool yet, create one now"
    case Filter.Funded:
      return "You haven't funded any pool yet"
  }
}

const MyPools: React.FC = ({ ...restProps }) => {
  const [activeFilter, setActiveFilter] = useState<Filter>(Filter.Invested)
  const [filtersExpansion, setFiltersExpansion] = useState<Record<Filter, boolean>>({
    [Filter.Invested]: false,
    [Filter.Sponsored]: false,
    [Filter.Funded]: false,
  })

  const { address: userAddress, appChainId } = useWeb3Connection()
  const { data: userResponse, error: errorUser } = useAelinUser(userAddress)

  if (errorUser) {
    throw errorUser
  }

  const { notifications } = useNotifications()

  return (
    <CollapsibleBlock title={'My pools'} {...restProps}>
      <Filters justifyContent="space-between">
        <TabButton
          isActive={activeFilter === Filter.Invested}
          onClick={() => {
            setActiveFilter(Filter.Invested)
          }}
        >
          {`Invested (${getPools(userResponse, Filter.Invested).length})`}
        </TabButton>
        <TabButton
          isActive={activeFilter === Filter.Sponsored}
          onClick={() => {
            setActiveFilter(Filter.Sponsored)
          }}
        >
          {`Sponsored (${getPools(userResponse, Filter.Sponsored).length})`}
        </TabButton>
        <TabButton
          isActive={activeFilter === Filter.Funded}
          onClick={() => {
            setActiveFilter(Filter.Funded)
          }}
        >
          {`Funded (${getPools(userResponse, Filter.Funded).length})`}
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
