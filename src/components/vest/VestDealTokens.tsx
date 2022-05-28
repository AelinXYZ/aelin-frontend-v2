import { useRouter } from 'next/router'
import { useState } from 'react'
import styled, { css } from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import isAfter from 'date-fns/isAfter'
import InfiniteScroll from 'react-infinite-scroll-component'

import { OrderDirection, VestingDeal_OrderBy } from '@/graphql-schema'
import { Deadline } from '@/src/components/common/Deadline'
import { Dropdown as BaseDropdown, DropdownItem } from '@/src/components/common/Dropdown'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import {
  ButtonDropdown,
  ButtonPrimaryLightSm,
  GradientButtonSm,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import {
  Cell as BaseCell,
  HideOnDesktop,
  LinkCell,
  LoadingTableRow,
  RowLink,
  TableBody,
  TableHead,
} from '@/src/components/pureStyledComponents/common/Table'
import { BaseTitle } from '@/src/components/pureStyledComponents/text/BaseTitle'
import { NameCell } from '@/src/components/table/NameCell'
import { SortableTH } from '@/src/components/table/SortableTH'
import { ChainsValues, getKeyChainByValue } from '@/src/constants/chains'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import useAelinAmountToVest from '@/src/hooks/aelin/useAelinAmountToVest'
import useAelinVestingDeals, { VestingDealsFilter } from '@/src/hooks/aelin/useAelinVestingDeals'
import { useAelinDealTransaction } from '@/src/hooks/contracts/useAelinDealTransaction'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { calculateDeadlineProgress } from '@/src/utils/aelinPoolUtils'
import { getFormattedDurationFromDateToNow } from '@/src/utils/date'
import { formatToken } from '@/src/web3/bigNumber'

const TableCard = styled.div`
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    background-color: ${({ theme: { card } }) => card.backgroundColor};
    border-radius: ${({ theme: { card } }) => card.borderRadius};
    border-width: 1px;
    border: ${({ theme: { card } }) => card.borderColor};
    padding: 40px;
  }
`

const Cell = styled(BaseCell)`
  font-weight: 400;
`

const Title = styled(BaseTitle)`
  display: none;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    display: block;
    margin-bottom: 20px;
  }
`

const ButtonCSS = css`
  min-width: 80px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    min-width: 0;
  }
`

const VestButton = styled(GradientButtonSm)`
  ${ButtonCSS}
`

const SeePoolButton = styled(ButtonPrimaryLightSm)`
  ${ButtonCSS}
`

const Value = styled.span`
  color: ${({ theme }) => theme.colors.textColor};
  font-weight: 500;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    color: ${({ theme }) => theme.colors.textColorLight};
    font-weight: 400;
  }
`

const Dropdown = styled(BaseDropdown)`
  margin-bottom: 20px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    max-width: 50%;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    max-width: 250px;
  }
`

type Order = {
  orderBy: VestingDeal_OrderBy
  orderDirection: OrderDirection
}

const VestActionButton = ({
  dealAddress,
  disabled,
  mutate,
  ...restProps
}: {
  disabled: boolean
  dealAddress: string
  mutate: () => void
}) => {
  const { execute: vestTokens } = useAelinDealTransaction(dealAddress, 'claim')
  const handleVestTokens = async () => {
    await vestTokens()
    mutate()
  }

  return (
    <VestButton
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault()
        handleVestTokens()
      }}
      {...restProps}
    >
      Vest
    </VestButton>
  )
}

type AmountToVestCellProps = {
  vestingPeriodStarts: Date
  vestingPeriodEnds: Date
  amountToVest: BigNumber | null
  poolAddress: string
  chainId: ChainsValues
  underlyingDealTokenDecimals: number
}

const AmountToVestCell = ({
  amountToVest,
  chainId,
  poolAddress,
  underlyingDealTokenDecimals,
  vestingPeriodEnds,
  vestingPeriodStarts,
}: AmountToVestCellProps) => {
  const now = new Date()
  const isVestingCliffEnded = isAfter(now, vestingPeriodStarts)
  const isVestindPeriodEnded = isAfter(now, vestingPeriodEnds)

  const withinInterval = isVestingCliffEnded && !isVestindPeriodEnded
  const [currentAmountToVest] = useAelinAmountToVest(poolAddress, chainId, withinInterval)

  return (
    <Cell mobileJustifyContent="center">
      <HideOnDesktop>Amount to vest:&nbsp;</HideOnDesktop>
      <Value>
        {formatToken(
          currentAmountToVest !== null ? currentAmountToVest : (amountToVest as BigNumber),
          underlyingDealTokenDecimals,
        )}
      </Value>
    </Cell>
  )
}

export const VestDealTokens: React.FC = ({ ...restProps }) => {
  const { address: user } = useWeb3Connection()
  const [order, setOrder] = useState<Order>({
    orderBy: VestingDeal_OrderBy.VestingPeriodEnds,
    orderDirection: OrderDirection.Desc,
  })
  const [vestingDealsFilter, setVestingDealsFilter] = useState<VestingDealsFilter>(
    VestingDealsFilter.Active,
  )

  const { data, error, hasMore, mutate, nextPage } = useAelinVestingDeals(
    {
      where: { user: user?.toLocaleLowerCase() || ZERO_ADDRESS },
      orderBy: order.orderBy,
      orderDirection: order.orderDirection,
    },
    vestingDealsFilter,
  )

  if (error) {
    throw error
  }

  const router = useRouter()
  const columns = {
    alignment: {
      network: 'center',
      seePool: 'right',
    },
    widths: '110px 115px 115px 132px 105px 165px 1fr',
  }

  const tableHeaderCells = [
    {
      title: 'Pool Name',
      sortKey: VestingDeal_OrderBy.TokenToVest,
    },
    {
      title: 'Token to vest',
      sortKey: VestingDeal_OrderBy.TokenToVest,
    },
    {
      title: 'My deal Total',
      sortKey: VestingDeal_OrderBy.InvestorDealTotal,
    },
    {
      title: 'Amount to vest',
      sortKey: VestingDeal_OrderBy.RemainingAmountToVest,
    },
    {
      title: 'Total vested',
      sortKey: VestingDeal_OrderBy.TotalVested,
    },
    {
      title: 'Vesting period ends',
      sortKey: VestingDeal_OrderBy.VestingPeriodEnds,
    },
  ]

  const handleSort = (sortBy: VestingDeal_OrderBy) => {
    if (order.orderBy === sortBy) {
      setOrder({
        orderBy: sortBy,
        orderDirection:
          order.orderDirection === OrderDirection.Asc ? OrderDirection.Desc : OrderDirection.Asc,
      })
    } else {
      setOrder({ orderBy: sortBy, orderDirection: OrderDirection.Desc })
    }
  }

  const vestingDealsFilterArr = Object.values(VestingDealsFilter) as Array<VestingDealsFilter>

  return (
    <TableCard id="outerWrapper" {...restProps}>
      <Title>Vest Deal Tokens</Title>
      <Dropdown
        currentItem={vestingDealsFilterArr.findIndex((vdf) => vdf === vestingDealsFilter)}
        dropdownButtonContent={<ButtonDropdown>{vestingDealsFilter}</ButtonDropdown>}
        items={vestingDealsFilterArr.map((vestingDeal, key) => (
          <DropdownItem key={key} onClick={() => setVestingDealsFilter(vestingDeal)}>
            {vestingDeal}
          </DropdownItem>
        ))}
      />
      <InfiniteScroll
        dataLength={data.length}
        hasMore={hasMore}
        loader={<LoadingTableRow />}
        next={nextPage}
        scrollableTarget={'outerWrapper'}
      >
        <TableHead columns={columns.widths}>
          {tableHeaderCells.map(({ sortKey, title }, index) => (
            <SortableTH
              isActive={order.orderBy === sortKey}
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
            {data.map((item, index) => {
              const {
                amountToVest,
                canVest,
                chainId,
                dealAddress,
                poolAddress,
                poolName,
                tokenSymbol,
                totalAmount,
                totalVested,
                underlyingDealTokenDecimals,
                vestingPeriodEnds,
                vestingPeriodStarts,
              } = item
              return (
                <RowLink
                  columns={columns.widths}
                  href={`/pool/${getKeyChainByValue(chainId)}/${poolAddress}`}
                  key={index}
                >
                  <NameCell mobileJustifyContent="center">{poolName}</NameCell>
                  <Cell mobileJustifyContent="center">{tokenSymbol}</Cell>
                  <Cell mobileJustifyContent="center">
                    <HideOnDesktop>My deal total:&nbsp;</HideOnDesktop>
                    <Value>{formatToken(totalAmount, underlyingDealTokenDecimals)}</Value>
                  </Cell>

                  <AmountToVestCell
                    amountToVest={amountToVest}
                    chainId={chainId}
                    poolAddress={poolAddress}
                    underlyingDealTokenDecimals={underlyingDealTokenDecimals}
                    vestingPeriodEnds={vestingPeriodEnds}
                    vestingPeriodStarts={vestingPeriodStarts}
                  />

                  <Cell mobileJustifyContent="center">
                    <HideOnDesktop>Total vested:&nbsp;</HideOnDesktop>
                    <Value>{formatToken(totalVested, underlyingDealTokenDecimals)}</Value>
                  </Cell>
                  <Cell style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
                    <HideOnDesktop>Vesting period ends:&nbsp;</HideOnDesktop>
                    <Deadline
                      progress={calculateDeadlineProgress(vestingPeriodEnds, vestingPeriodStarts)}
                    >
                      {getFormattedDurationFromDateToNow(vestingPeriodEnds, 'ended')}
                    </Deadline>
                  </Cell>
                  <LinkCell flexFlowColumn justifyContent={columns.alignment.seePool}>
                    <VestActionButton
                      dealAddress={dealAddress}
                      disabled={!canVest}
                      mutate={mutate}
                    />
                    <SeePoolButton
                      onClick={(e) => {
                        e.preventDefault()
                        router.push(`/pool/${getKeyChainByValue(chainId)}/${poolAddress}`)
                      }}
                    >
                      See Pool
                    </SeePoolButton>
                  </LinkCell>
                </RowLink>
              )
            })}
          </TableBody>
        )}
      </InfiniteScroll>
    </TableCard>
  )
}

export default genericSuspense(VestDealTokens)
