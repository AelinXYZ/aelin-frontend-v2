import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import InfiniteScroll from 'react-infinite-scroll-component'
import ReactTooltip from 'react-tooltip'

import { OrderDirection, PoolCreated_OrderBy, PoolsCreatedQueryVariables } from '@/graphql-schema'
import ENSOrAddress from '@/src/components/aelin/ENSOrAddress'
import { Lock } from '@/src/components/assets/Lock'
import { DynamicDeadline as BaseDynamicDeadline } from '@/src/components/common/DynamicDeadline'
import { TokenIcon } from '@/src/components/pools/common/TokenIcon'
import { Badge } from '@/src/components/pureStyledComponents/common/Badge'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import {
  HideOnDesktop as BaseHideOnDesktop,
  RowLink as BaseRowLink,
  TableHead as BaseTableHead,
  Cell,
  HideOnMobile,
  HideOnMobileCell,
  LoadingTableRow,
  TableBody,
} from '@/src/components/pureStyledComponents/common/Table'
import { NameCell } from '@/src/components/table/NameCell'
import { SortableTH as BaseSortableTH } from '@/src/components/table/SortableTH'
import { Stage } from '@/src/components/table/Stage'
import { ChainsValues, getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import { poolStagesText } from '@/src/constants/pool'
import useAelinPools from '@/src/hooks/aelin/useAelinPools'
import { useNotifications } from '@/src/providers/notificationsProvider'
import { isMerklePool, isPrivatePool } from '@/src/utils/aelinPoolUtils'
import { getFormattedDurationFromDateToNow } from '@/src/utils/date'

const columns = {
  alignment: {
    investmentToken: 'center',
    network: 'center',
  },
  widths: '275px 84px 75px 0.8fr 1fr 150px 80px',
  compactWidths: '260px 84px 70px 1fr 80px',
}

const compactRowEnd = '1400px'

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

const Label = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  background: ${({ theme }) => theme.buttonPrimary.backgroundColor};
  border: 0.5px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  font-size: 9px;
  line-height: 14px;
`

const HideOnDesktop = styled(BaseHideOnDesktop)`
  .networkIcon {
    height: 14px;
    width: 14px;
  }
`

const LabelsWrapper = styled.div`
  display: flex;
  gap: 5px;
`

const TableHead = styled(BaseTableHead)`
  @media (min-width: ${({ theme }) =>
    theme.themeBreakPoints.tabletLandscapeStart}) and (max-width: ${compactRowEnd}) {
    grid-template-columns: ${columns.compactWidths};
  }}
`

const SortableTH = styled(BaseSortableTH)<{ isSecondary?: boolean }>`
  ${({ isSecondary }) =>
    isSecondary &&
    css`
      @media (min-width: ${({ theme }) =>
          theme.themeBreakPoints.tabletLandscapeStart}) and (max-width: ${compactRowEnd}) {
        display: none;
      }
    `}
`

const RowLink = styled(BaseRowLink)`
  @media (min-width: ${({ theme }) =>
      theme.themeBreakPoints.tabletLandscapeStart}) and (max-width: ${compactRowEnd}) {
    grid-template-columns: ${columns.compactWidths};
  }
`

const DynamicDeadline = styled(BaseDynamicDeadline)`
  @media (min-width: ${({ theme }) =>
      theme.themeBreakPoints.tabletLandscapeStart}) and (max-width: ${compactRowEnd}) {
    display: none;
  }
`

const InvestmentToken = styled(Cell)`
  @media (max-width: ${compactRowEnd}) {
    display: none;
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

  const tableHeaderCells = [
    {
      title: 'Name',
      sortKey: PoolCreated_OrderBy.Name,
    },
    {
      title: 'Sponsor',
      // sortKey: PoolCreated_OrderBy.Sponsor,
    },
    {
      title: 'Network',
      // justifyContent: columns.alignment.network,
    },
    {
      title: 'Total deposited',
      // sortKey: PoolCreated_OrderBy.TotalAmountFunded,
    },
    {
      title: 'Investment deadline',
      sortKey: PoolCreated_OrderBy.PurchaseExpiry,
      isSecondary: true,
    },
    {
      title: 'Investment token',
      justifyContent: columns.alignment.investmentToken,
      isSecondary: true,
      // sortKey: PoolCreated_OrderBy.PurchaseToken,
    },
    {
      title: 'Stage',
      // sortKey: PoolCreated_OrderBy.PoolStatus,
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

  const getSortableHandler = (sortKey: PoolCreated_OrderBy | undefined) =>
    sortKey ? () => handleSort(sortKey) : undefined

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  return (
    <InfiniteScroll
      dataLength={data.length}
      hasMore={hasMore}
      loader={<LoadingTableRow />}
      next={nextPage}
    >
      <TableHead columns={columns.widths}>
        {tableHeaderCells.map(({ isSecondary, justifyContent, sortKey, title }, index) => (
          <SortableTH
            isActive={sortBy === sortKey}
            isSecondary={isSecondary}
            justifyContent={justifyContent}
            key={index}
            onClick={getSortableHandler(sortKey)}
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
              chainId: network,
              funded,
              investmentToken,
              investmentTokenSymbol,
              nameFormatted,
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
                  <Name>{nameFormatted}</Name>

                  {!!activeNotifications && (
                    <Badge
                      data-html={true}
                      data-multiline={true}
                      data-tip={`You have ${
                        activeNotifications > 1 ? 'notifications' : 'one notification'
                      } for this pool.`}
                    >
                      {activeNotifications.toString()}
                    </Badge>
                  )}
                  <HideOnMobile>
                    <LabelsWrapper>
                      {isPrivatePool(pool.poolType) && (
                        <Label>
                          <span>Private</span>
                          <Lock />
                        </Label>
                      )}

                      {isMerklePool(pool) && (
                        <Label>
                          <span>Merkle Tree</span>
                          <Lock />
                        </Label>
                      )}

                      {!!pool.hasNftList && (
                        <Label>
                          <span>NFT</span>
                          <Lock />
                        </Label>
                      )}

                      {!!pool.upfrontDeal && (
                        <Label>
                          <span>Deal</span>
                        </Label>
                      )}
                    </LabelsWrapper>
                  </HideOnMobile>
                </NameCell>
                <HideOnDesktop>
                  <LabelsWrapper>
                    {isPrivatePool(pool.poolType) && (
                      <Label>
                        <span>Private</span>
                        <Lock />
                      </Label>
                    )}

                    {isMerklePool(pool) && (
                      <Label>
                        <span>Merkle Tree</span>
                        <Lock />
                      </Label>
                    )}

                    {!!pool.hasNftList && (
                      <Label>
                        <span>NFT</span>
                        <Lock />
                      </Label>
                    )}

                    {!!pool.upfrontDeal && (
                      <Label>
                        <span>Deal</span>
                      </Label>
                    )}
                    <HideOnDesktop>{getNetworkConfig(network).icon}</HideOnDesktop>
                  </LabelsWrapper>
                </HideOnDesktop>
                <ENSOrAddress address={sponsor} network={network} />
                <HideOnMobileCell
                  justifyContent={columns.alignment.network}
                  title={getNetworkConfig(network).shortName}
                >
                  {getNetworkConfig(network).icon}
                </HideOnMobileCell>
                <Cell>
                  {funded.formatted}
                  &nbsp;
                  <HideOnMobile>{investmentTokenSymbol}</HideOnMobile>
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
                <DynamicDeadline
                  deadline={purchaseExpiry}
                  hideWhenDeadlineIsReached={false}
                  start={start}
                >
                  {getFormattedDurationFromDateToNow(purchaseExpiry)}
                </DynamicDeadline>
                <InvestmentToken justifyContent={columns.alignment.investmentToken}>
                  <TokenIcon
                    address={investmentToken}
                    network={network}
                    symbol={investmentTokenSymbol}
                    type="column"
                  />
                </InvestmentToken>
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
