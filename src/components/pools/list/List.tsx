import { useState } from 'react'
import styled from 'styled-components'

import InfiniteScroll from 'react-infinite-scroll-component'

import { OrderDirection, PoolCreated_OrderBy, PoolsCreatedQueryVariables } from '@/graphql-schema'
import ENSOrAddress from '@/src/components/aelin/ENSOrAddress'
import { Deadline } from '@/src/components/common/Deadline'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import {
  Cell,
  HideOnDesktop,
  HideOnMobileCell,
  LoadingTableRow,
  RowLink,
  Table,
  TableBody,
  TableHead,
} from '@/src/components/pureStyledComponents/common/Table'
import { NameCell as BaseNameCell } from '@/src/components/table/NameCell'
import { SortableTH } from '@/src/components/table/SortableTH'
import { Stage } from '@/src/components/table/Stage'
import { ChainsValues, getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import useAelinPools from '@/src/hooks/aelin/useAelinPools'
import { calculateInvestmentDeadlineProgress, getStatusText } from '@/src/utils/aelinPoolUtils'
import { getFormattedDurationFromDateToNow } from '@/src/utils/date'

const NameCell = styled(BaseNameCell)`
  .networkIcon {
    height: 14px;
    width: 14px;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    .networkIcon {
      height: auto;
      width: auto;
    }
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
}> = ({ filters, setOrderBy, setOrderDirection, ...restProps }) => {
  const { data, error, hasMore, nextPage } = useAelinPools(filters.variables, filters.network)

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
      <Table {...restProps}>
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
                investmentTokenSymbol,
                name,
                purchaseExpiry,
                sponsor,
                stage,
                start,
              } = pool
              return (
                <RowLink
                  columns={columns.widths}
                  href={`/pool/${getKeyChainByValue(network)}/${id}`}
                  key={id}
                >
                  <NameCell>
                    {name.split('aePool-').pop()}
                    <HideOnDesktop>{getNetworkConfig(network).icon}</HideOnDesktop>
                  </NameCell>
                  <Cell>
                    <ENSOrAddress address={sponsor} network={network} />
                  </Cell>
                  <HideOnMobileCell
                    justifyContent={columns.alignment.network}
                    title={getNetworkConfig(network).name}
                  >
                    {getNetworkConfig(network).icon}
                  </HideOnMobileCell>
                  <Cell>
                    ${amountInPool.formatted}&nbsp;
                    <HideOnDesktop>{investmentTokenSymbol}</HideOnDesktop>
                  </Cell>
                  <Deadline progress={calculateInvestmentDeadlineProgress(purchaseExpiry, start)}>
                    {getFormattedDurationFromDateToNow(purchaseExpiry, 'ended')}
                  </Deadline>
                  <HideOnMobileCell justifyContent={columns.alignment.investmentToken}>
                    {investmentTokenSymbol}
                  </HideOnMobileCell>
                  <Stage stage={stage.toLowerCase()}> {getStatusText({ poolStatus: stage })}</Stage>
                </RowLink>
              )
            })}
          </TableBody>
        )}
      </Table>
    </InfiniteScroll>
  )
}

export default List
