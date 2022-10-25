import { useRouter } from 'next/router'
import { useState } from 'react'
import styled, { css } from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import isAfter from 'date-fns/isAfter'
import InfiniteScroll from 'react-infinite-scroll-component'

import { OrderDirection, VestingDeal_OrderBy } from '@/graphql-schema'
import { Dropdown as BaseDropdown, DropdownItem } from '@/src/components/common/Dropdown'
import { DynamicDeadline } from '@/src/components/common/DynamicDeadline'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import {
  ButtonDropdown,
  ButtonGradientSm,
  ButtonPrimaryLight,
  ButtonPrimaryLightSm,
} from '@/src/components/pureStyledComponents/buttons/Button'
import {
  Cell as BaseCell,
  HideOnDesktop,
  LinkCell,
  LoadingTableRow,
  Row,
  TableBody,
  TableHead,
} from '@/src/components/pureStyledComponents/common/Table'
import { BaseTitle } from '@/src/components/pureStyledComponents/text/BaseTitle'
import { NameCell } from '@/src/components/table/NameCell'
import { SortableTH } from '@/src/components/table/SortableTH'
import { ChainsValues, getKeyChainByValue } from '@/src/constants/chains'
import { getNetworkConfig } from '@/src/constants/chains'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import useAelinAmountToVest from '@/src/hooks/aelin/useAelinAmountToVest'
import useAelinAmountToVestUpfrontDeal from '@/src/hooks/aelin/useAelinAmountToVestUpfrontDeal'
import useAelinVestingDeals, { VestingDealsFilter } from '@/src/hooks/aelin/useAelinVestingDeals'
import { useAelinDealTransaction } from '@/src/hooks/contracts/useAelinDealTransaction'
import { useAelinPoolUpfrontDealTransaction } from '@/src/hooks/contracts/useAelinPoolUpfrontDealTransaction'
import { RequiredConnection } from '@/src/hooks/requiredConnection'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getFormattedDurationFromDateToNow } from '@/src/utils/date'
import { formatToken } from '@/src/web3/bigNumber'

const TableCard = styled.div`
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    background-color: ${({ theme: { card } }) => card.backgroundColor};
    border-radius: 8px;
    border-width: 1px;
    border: ${({ theme: { card } }) => card.borderColor};
    padding: 40px;
  }
`

export const WrapperEmpty = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const Subtitle = styled.p`
  text-align: center;
`

const ButtonCSS = css`
  min-width: 80px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    min-width: 0;
  }
`

const VestButton = styled(ButtonGradientSm)`
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
  refetch,
  upfrontDealAddress,
  ...restProps
}: {
  disabled: boolean
  dealAddress: string | null
  upfrontDealAddress: string | null
  refetch: () => void
}) => {
  const { execute: vestTokensSponsorDeal } = useAelinDealTransaction(
    dealAddress || ZERO_ADDRESS,
    'claim',
  )
  const { execute: vestTokensUpfrontDeal } = useAelinPoolUpfrontDealTransaction(
    upfrontDealAddress || ZERO_ADDRESS,
    'claimUnderlying',
  )

  const handleVestTokens = async () => {
    upfrontDealAddress ? await vestTokensUpfrontDeal() : await vestTokensSponsorDeal()
    refetch()
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
  tokenSymbol: string
  chainId: ChainsValues
  underlyingDealTokenDecimals: number
}

type AmountToVestCellComponentProps = {
  currentAmountToVest: BigNumber | null
  amountToVest: BigNumber | null
  underlyingDealTokenDecimals: number
  tokenSymbol: string
}

const Wrapper: React.FC = ({ children, ...restProps }) => (
  <TableCard id="outerWrapper" {...restProps}>
    <Title>Vest Deal Tokens</Title>
    {children}
  </TableCard>
)

export const VestDealTokens: React.FC = ({ ...restProps }) => {
  const { address: user } = useWeb3Connection()
  const [order, setOrder] = useState<Order>({
    orderBy: VestingDeal_OrderBy.VestingPeriodEnds,
    orderDirection: OrderDirection.Desc,
  })
  const [vestingDealsFilter, setVestingDealsFilter] = useState<VestingDealsFilter>(
    VestingDealsFilter.Active,
  )

  const {
    data,
    error,
    hasMore,
    mutate: refetch,
    nextPage,
  } = useAelinVestingDeals(
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
    widths: '110px 115px 132px 115px 170px 80px 1fr',
  }

  const tableHeaderCells = [
    {
      title: 'Pool Name',
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
    { title: 'Network' },
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

  if (!data.length) {
    return (
      <WrapperEmpty>
        <Title>Vest</Title>
        <Subtitle>
          You don't have any deal tokens to vest. Once you do,
          <br />
          vesting information will be shown below!
        </Subtitle>
        <ButtonPrimaryLight
          onClick={() => {
            router.push('/')
          }}
        >
          Join a pool
        </ButtonPrimaryLight>
      </WrapperEmpty>
    )
  }

  return (
    <Wrapper {...restProps}>
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
                if (sortKey) handleSort(sortKey)
              }}
            >
              {title}
            </SortableTH>
          ))}
        </TableHead>
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
              upfrontDealAddress,
              vestingPeriodEnds,
              vestingPeriodStarts,
            } = item
            return (
              <Row columns={columns.widths} key={index}>
                <NameCell mobileJustifyContent="center">{poolName}</NameCell>
                <Cell mobileJustifyContent="center">
                  <HideOnDesktop>My deal total:&nbsp;</HideOnDesktop>
                  <Value>
                    {formatToken(totalAmount, underlyingDealTokenDecimals)} {tokenSymbol}
                  </Value>
                </Cell>
                <AmountToVestCell
                  amountToVest={amountToVest}
                  chainId={chainId}
                  isUpfrontDeal={!!upfrontDealAddress}
                  poolAddress={poolAddress}
                  tokenSymbol={tokenSymbol}
                  underlyingDealTokenDecimals={underlyingDealTokenDecimals}
                  vestingPeriodEnds={vestingPeriodEnds}
                  vestingPeriodStarts={vestingPeriodStarts}
                />
                <Cell mobileJustifyContent="center">
                  <HideOnDesktop>Total vested:&nbsp;</HideOnDesktop>
                  <Value>
                    {formatToken(totalVested, underlyingDealTokenDecimals)} {tokenSymbol}
                  </Value>
                </Cell>
                <Cell style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
                  <HideOnDesktop>Vesting period ends:&nbsp;</HideOnDesktop>
                  <DynamicDeadline deadline={vestingPeriodEnds} start={vestingPeriodStarts}>
                    {getFormattedDurationFromDateToNow(vestingPeriodEnds)}
                  </DynamicDeadline>
                </Cell>
                <Cell justifyContent="center" mobileJustifyContent="center">
                  <HideOnDesktop>Network</HideOnDesktop>
                  {getNetworkConfig(chainId).icon}
                </Cell>
                <LinkCell flexFlowColumn justifyContent={columns.alignment.seePool}>
                  <RequiredConnection
                    buttonSize="sm"
                    isNotConnectedText=""
                    isWrongNetworkText=""
                    networkToCheck={chainId}
                  >
                    <VestActionButton
                      dealAddress={dealAddress}
                      disabled={!canVest}
                      refetch={refetch}
                      upfrontDealAddress={upfrontDealAddress}
                    />
                  </RequiredConnection>

                  <SeePoolButton
                    onClick={(e) => {
                      e.preventDefault()
                      router.push(`/pool/${getKeyChainByValue(chainId)}/${poolAddress}`)
                    }}
                  >
                    See Pool
                  </SeePoolButton>
                </LinkCell>
              </Row>
            )
          })}
        </TableBody>
      </InfiniteScroll>
    </Wrapper>
  )
}

export default genericSuspense(VestDealTokens)

function AmountToVestCell({
  amountToVest,
  chainId,
  isUpfrontDeal,
  poolAddress,
  tokenSymbol,
  underlyingDealTokenDecimals,
  vestingPeriodEnds,
  vestingPeriodStarts,
}: AmountToVestCellProps & { isUpfrontDeal: boolean }) {
  return isUpfrontDeal ? (
    <AmountToVestCellUpfrontDeal
      amountToVest={amountToVest}
      chainId={chainId}
      poolAddress={poolAddress}
      tokenSymbol={tokenSymbol}
      underlyingDealTokenDecimals={underlyingDealTokenDecimals}
      vestingPeriodEnds={vestingPeriodEnds}
      vestingPeriodStarts={vestingPeriodStarts}
    />
  ) : (
    <AmountToVestCellSponsorDeal
      amountToVest={amountToVest}
      chainId={chainId}
      poolAddress={poolAddress}
      tokenSymbol={tokenSymbol}
      underlyingDealTokenDecimals={underlyingDealTokenDecimals}
      vestingPeriodEnds={vestingPeriodEnds}
      vestingPeriodStarts={vestingPeriodStarts}
    />
  )
}

function AmountToVestCellSponsorDeal({
  amountToVest,
  chainId,
  poolAddress,
  tokenSymbol,
  underlyingDealTokenDecimals,
  vestingPeriodEnds,
  vestingPeriodStarts,
}: AmountToVestCellProps) {
  const now = new Date()
  const isVestingCliffEnded = isAfter(now, vestingPeriodStarts)
  const isVestindPeriodEnded = isAfter(now, vestingPeriodEnds)

  const withinInterval = isVestingCliffEnded && !isVestindPeriodEnded
  const [currentAmountToVest] = useAelinAmountToVest(poolAddress, chainId, withinInterval)

  return (
    <AmountToVestCellComponent
      amountToVest={amountToVest}
      currentAmountToVest={currentAmountToVest}
      tokenSymbol={tokenSymbol}
      underlyingDealTokenDecimals={underlyingDealTokenDecimals}
    />
  )
}

function AmountToVestCellUpfrontDeal({
  amountToVest,
  chainId,
  poolAddress,
  tokenSymbol,
  underlyingDealTokenDecimals,
  vestingPeriodEnds,
  vestingPeriodStarts,
}: AmountToVestCellProps) {
  const now = new Date()
  const isVestingCliffEnded = isAfter(now, vestingPeriodStarts)
  const isVestindPeriodEnded = isAfter(now, vestingPeriodEnds)

  const withinInterval = isVestingCliffEnded && !isVestindPeriodEnded
  const [currentAmountToVest] = useAelinAmountToVestUpfrontDeal(
    poolAddress,
    chainId,
    withinInterval,
  )

  return (
    <AmountToVestCellComponent
      amountToVest={amountToVest}
      currentAmountToVest={currentAmountToVest}
      tokenSymbol={tokenSymbol}
      underlyingDealTokenDecimals={underlyingDealTokenDecimals}
    />
  )
}

function AmountToVestCellComponent({
  amountToVest,
  currentAmountToVest,
  tokenSymbol,
  underlyingDealTokenDecimals,
}: AmountToVestCellComponentProps) {
  return (
    <Cell mobileJustifyContent="center">
      <HideOnDesktop>Amount to vest:&nbsp;</HideOnDesktop>
      <Value>
        {formatToken(
          currentAmountToVest !== null ? currentAmountToVest : (amountToVest as BigNumber),
          underlyingDealTokenDecimals,
        )}{' '}
        {tokenSymbol}
      </Value>
    </Cell>
  )
}
