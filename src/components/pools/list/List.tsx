import { useState } from 'react'
import styled from 'styled-components'

import InfiniteScroll from 'react-infinite-scroll-component'

import { TokenIcon } from '../common/TokenIcon'
import { OrderDirection, PoolCreated_OrderBy, PoolsCreatedQueryVariables } from '@/graphql-schema'
import ENSOrAddress from '@/src/components/aelin/ENSOrAddress'
import { Deadline } from '@/src/components/common/Deadline'
import { Badge } from '@/src/components/pureStyledComponents/common/Badge'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import {
  HideOnDesktop as BaseHideOnDesktop,
  Cell,
  HideOnMobileCell,
  LoadingTableRow,
  RowLink,
  TableBody,
  TableHead,
} from '@/src/components/pureStyledComponents/common/Table'
import { NameCell } from '@/src/components/table/NameCell'
import { SortableTH } from '@/src/components/table/SortableTH'
import { Stage } from '@/src/components/table/Stage'
import { ChainsValues, getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import { poolStagesText } from '@/src/constants/pool'
import useAelinPools from '@/src/hooks/aelin/useAelinPools'
import { useNotifications } from '@/src/providers/notificationsProvider'
import { calculateDeadlineProgress } from '@/src/utils/aelinPoolUtils'
import { getFormattedDurationFromDateToNow } from '@/src/utils/date'

const Name = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const TokenIconSmall = styled(TokenIcon)`
  margin-left: 5px;
  margin-top: -2px;

  .externalLink {
    font-size: 1.2rem !important;
  }
`

const HideOnDesktop = styled(BaseHideOnDesktop)`
  .networkIcon {
    height: 14px;
    width: 14px;
  }
`

interface FiltersProps {
  network: ChainsValues | null
  variables: PoolsCreatedQueryVariables
}

export const List: React.FC<{
  filters: FiltersProps
  setOrderBy: (value: PoolCreated_OrderBy | undefined) => void
  setOrderDirection: (value: OrderDirection) => void
}> = ({ filters, setOrderBy, setOrderDirection }) => {
  const { data, error, hasMore, nextPage } = useAelinPools(filters.variables, filters.network)

  const { notifications } = useNotifications()

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
      sortKey: PoolCreated_OrderBy.Name,
    },
    {
      title: 'Sponsor',
      sortKey: PoolCreated_OrderBy.Sponsor,
    },
    {
      title: 'Network',
      justifyContent: columns.alignment.network,
    },
    {
      title: 'Amount in Pool',
      sortKey: PoolCreated_OrderBy.TotalSupply,
    },
    {
      title: 'Investment deadline',
      sortKey: PoolCreated_OrderBy.PurchaseExpiry,
    },
    {
      title: 'Investment token',
      justifyContent: columns.alignment.investmentToken,
      sortKey: PoolCreated_OrderBy.PurchaseToken,
    },
    {
      title: 'Stage',
      sortKey: PoolCreated_OrderBy.PoolStatus,
    },
  ]

  const [sortBy, setSortBy] = useState<string | undefined>()

  const handleSort = (sortBy: PoolCreated_OrderBy | undefined) => {
    if (sortBy === filters.variables.orderBy) {
      if (filters.variables.orderDirection === OrderDirection.Desc) {
        setOrderDirection(OrderDirection.Asc)
      } else {
        setOrderDirection(OrderDirection.Desc)
        setOrderBy(undefined)
        return setSortBy(undefined)
      }
    } else {
      setSortBy(sortBy)
      setOrderDirection(OrderDirection.Desc)
      setOrderBy(sortBy as PoolCreated_OrderBy)
    }
  }

  return (
    <InfiniteScroll
      dataLength={data.length}
      hasMore={hasMore}
      loader={<LoadingTableRow />}
      next={nextPage}
    >
      <TableHead columns={columns.widths}>
        {tableHeaderCells.map(({ justifyContent, sortKey, title }, index) => (
          <SortableTH
            isActive={sortBy === sortKey}
            justifyContent={justifyContent}
            key={index}
            onClick={() => {
              handleSort(sortKey)
            }}
          >
            {title}
          </SortableTH>
        ))}
      </TableHead>
      {!data.length ? (
        <BaseCard>No data.</BaseCard>
      ) : (
        <TableBody>
          {data.map((pool) => {
            const {
              address: id,
              amountInPool,
              chainId: network,
              investmentToken,
              investmentTokenSymbol,
              name,
              purchaseExpiry,
              sponsor,
              stage,
              start,
            } = pool
            const activeNotifications = notifications.filter((n) => n.poolAddress === id).length

            return (
              <RowLink
                columns={columns.widths}
                href={`/pool/${getKeyChainByValue(network)}/${id}`}
                key={id}
              >
                <NameCell>
                  <Name>{name.split('aePool-').pop()}</Name>
                  {activeNotifications ? <Badge>{activeNotifications.toString()}</Badge> : null}
                  <HideOnDesktop>{getNetworkConfig(network).icon}</HideOnDesktop>
                </NameCell>
                <ENSOrAddress address={sponsor} network={network} />
                <HideOnMobileCell
                  justifyContent={columns.alignment.network}
                  title={getNetworkConfig(network).name}
                >
                  {getNetworkConfig(network).icon}
                </HideOnMobileCell>
                <Cell>
                  ${amountInPool.formatted}&nbsp;
                  <HideOnDesktop>
                    <TokenIconSmall
                      address={investmentToken}
                      iconHeight={12}
                      iconWidth={12}
                      network={network}
                      symbol={investmentTokenSymbol}
                      type="row"
                    />
                  </HideOnDesktop>
                </Cell>
                <Deadline progress={calculateDeadlineProgress(purchaseExpiry, start)}>
                  {getFormattedDurationFromDateToNow(purchaseExpiry, 'ended')}
                </Deadline>
                <HideOnMobileCell justifyContent={columns.alignment.investmentToken}>
                  <TokenIcon
                    address={investmentToken}
                    network={network}
                    symbol={investmentTokenSymbol}
                    type="column"
                  />
                </HideOnMobileCell>
                <Stage stage={stage}> {poolStagesText[stage]}</Stage>
              </RowLink>
            )
          })}
        </TableBody>
      )}
    </InfiniteScroll>
  )
}

export default List
