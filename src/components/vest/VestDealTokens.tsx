import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import InfiniteScroll from 'react-infinite-scroll-component'

import { Deadline } from '../common/Deadline'
import { OrderDirection, VestingDeal_OrderBy } from '@/graphql-schema'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import {
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
  Table,
  TableBody,
  TableHead,
  TableWrapper,
} from '@/src/components/pureStyledComponents/common/Table'
import { BaseTitle } from '@/src/components/pureStyledComponents/text/BaseTitle'
import { NameCell } from '@/src/components/table/NameCell'
import { SortableTH } from '@/src/components/table/SortableTH'
import { getKeyChainByValue } from '@/src/constants/chains'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import useAelinClaimableTokens from '@/src/hooks/aelin/useAelinClaimableTokens'
import useAelinVestingDeals, { ParsedVestingDeal } from '@/src/hooks/aelin/useAelinVestingDeals'
import { useAelinDealTransaction } from '@/src/hooks/contracts/useAelinDealTransaction'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { calculateInvestmentDeadlineProgress as calculateVestingDealLineProgress } from '@/src/utils/aelinPoolUtils'
import { getFormattedDurationFromDateToNow } from '@/src/utils/date'
import formatNumber from '@/src/utils/formatNumber'

const TableCard = styled.div`
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    background-color: ${({ theme: { card } }) => card.backgroundColor};
    border-radius: ${({ theme: { card } }) => card.borderRadius};
    border-width: 1px;
    border: ${({ theme: { card } }) => card.borderColor};
    padding: 40px 50px;
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

const AmountToVestCell = ({ ...item }: ParsedVestingDeal) => {
  const { chainId, myDealTotal, poolAddress, totalVested } = item
  const amountToVest = useAelinClaimableTokens(poolAddress, chainId, myDealTotal, totalVested)

  return (
    <Cell mobileJustifyContent="center">
      <HideOnDesktop>Amount to vest:&nbsp;</HideOnDesktop>
      <Value>{formatNumber(amountToVest)}</Value>
    </Cell>
  )
}

export const VestDealTokens: React.FC = ({ ...restProps }) => {
  const { address: user } = useWeb3Connection()
  const [order, setOrder] = useState<Order>({
    orderBy: VestingDeal_OrderBy.VestingPeriodEnds,
    orderDirection: OrderDirection.Desc,
  })

  const { data, error, hasMore, mutate, nextPage } = useAelinVestingDeals({
    where: { user: user?.toLocaleLowerCase() || ZERO_ADDRESS },
    orderBy: order.orderBy,
    orderDirection: order.orderDirection,
  })

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

  const length = useMemo(() => data?.length, [data?.length])

  return (
    <TableCard {...restProps}>
      <Title>Vest Deal Tokens</Title>
      <InfiniteScroll
        dataLength={length}
        hasMore={hasMore}
        loader={<LoadingTableRow />}
        next={nextPage}
      >
        <Table>
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
          {!data?.length ? (
            <BaseCard>No data.</BaseCard>
          ) : (
            <TableBody>
              {data.map((item, index) => {
                const {
                  canVest,
                  chainId,
                  dealAddress,
                  myDealTotal,
                  poolAddress,
                  poolName,
                  tokenToVest,
                  totalVested,
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
                    <Cell mobileJustifyContent="center">{tokenToVest}</Cell>
                    <Cell mobileJustifyContent="center">
                      <HideOnDesktop>My deal total:&nbsp;</HideOnDesktop>
                      <Value>{myDealTotal}</Value>
                    </Cell>
                    <AmountToVestCell {...item} />
                    <Cell mobileJustifyContent="center">
                      <HideOnDesktop>Total vested:&nbsp;</HideOnDesktop>
                      <Value>{totalVested}</Value>
                    </Cell>
                    <Cell style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
                      <HideOnDesktop>Vesting period ends:&nbsp;</HideOnDesktop>
                      <Deadline
                        progress={calculateVestingDealLineProgress(
                          vestingPeriodEnds,
                          vestingPeriodStarts,
                        )}
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
        </Table>
      </InfiniteScroll>
    </TableCard>
  )
}

export default genericSuspense(VestDealTokens)
