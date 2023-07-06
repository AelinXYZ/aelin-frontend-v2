import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import styled, { css } from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import isAfter from 'date-fns/isAfter'
import ms from 'ms'
import InfiniteScroll from 'react-infinite-scroll-component'

import TransferVestingShareModal from '../pools/actions/Vest/TransferVestingShareModal'
import UpfrontDealTransferVestingShareModal from '../pools/actions/Vest/UpfrontDealTransferVestingShareModal'
import { OrderDirection, VestingDeal_OrderBy } from '@/graphql-schema'
import { Dropdown as BaseDropdown, DropdownItem } from '@/src/components/common/Dropdown'
import { DynamicDeadline } from '@/src/components/common/DynamicDeadline'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import {
  ButtonDropdown,
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
import VestActionButton from '@/src/components/vest/buttons/VestActionButton'
import VestUpfrontDealActionButton from '@/src/components/vest/buttons/VestUpfrontDealActionButton'
import { ChainsValues, getKeyChainByValue } from '@/src/constants/chains'
import { getNetworkConfig } from '@/src/constants/chains'
import { DISPLAY_DECIMALS, ZERO_ADDRESS } from '@/src/constants/misc'
import useAelinAmountToVest from '@/src/hooks/aelin/useAelinAmountToVest'
import useAelinAmountToVestUpfrontDeal from '@/src/hooks/aelin/useAelinAmountToVestUpfrontDeal'
import useAelinVestingDeals, {
  ParsedVestingDeal,
  VestingDealsFilter,
} from '@/src/hooks/aelin/useAelinVestingDeals'
import useGetVestingTokens from '@/src/hooks/aelin/useGetVestingTokens'
import { RequiredConnection } from '@/src/hooks/requiredConnection'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getFormattedDurationFromDateToNow } from '@/src/utils/date'
import { isHiddenPool } from '@/src/utils/isHiddenPool'
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

const Button = styled(ButtonPrimaryLightSm)`
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

type AmountToVestCellProps = {
  vestingPeriodStarts: Date
  vestingPeriodEnds: Date
  poolAddress: string
  tokenSymbol: string
  chainId: ChainsValues
  underlyingDealTokenDecimals: number
  isDealTokenTransferable: boolean
}

type AmountToVestCellComponentProps = {
  amountToVest: BigNumber | null
  underlyingDealTokenDecimals: number
  tokenSymbol: string
}

type WrapperProps = {
  children: ReactNode
}

const Wrapper = ({ children }: WrapperProps) => (
  <TableCard id="outerWrapper">
    <Title>Vest Deal Tokens</Title>
    {children}
  </TableCard>
)

export const VestDealTokens: React.FC = () => {
  const { address: user } = useWeb3Connection()
  const [order, setOrder] = useState<Order>({
    orderBy: VestingDeal_OrderBy.VestingPeriodEnds,
    orderDirection: OrderDirection.Desc,
  })
  const [vestingDealsFilter, setVestingDealsFilter] = useState<VestingDealsFilter>(
    VestingDealsFilter.Active,
  )
  const [transferVestingModalPoolAddress, setTransferVestingModalPoolAddress] = useState<
    string | null
  >(null)
  const [
    upfrontDealTransferVestingModalPoolAddress,
    setUpfrontDealTransferVestingModalPoolAddress,
  ] = useState<string | null>(null)

  const { data, error, hasMore, nextPage } = useAelinVestingDeals(
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
    widths: '110px 120px 140px 115px 120px 90px 1fr',
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
      title: 'Vesting ends',
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
    <>
      <Wrapper>
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
                chainId,
                dealAddress,
                isDealTokenTransferable,
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
                      {formatToken(totalAmount, underlyingDealTokenDecimals, DISPLAY_DECIMALS)}{' '}
                      {tokenSymbol}
                    </Value>
                  </Cell>
                  <AmountToVestCell
                    chainId={chainId}
                    dealAddress={dealAddress as string}
                    isDealTokenTransferable={isDealTokenTransferable}
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
                      {formatToken(totalVested, underlyingDealTokenDecimals, DISPLAY_DECIMALS)}{' '}
                      {tokenSymbol}
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
                      {item.upfrontDealAddress ? (
                        <VestUpfrontDealActionButton pool={item} />
                      ) : (
                        <VestActionButton pool={item} />
                      )}
                    </RequiredConnection>
                    <TransferActionButton
                      onClick={(e) => {
                        e.preventDefault()
                        item.upfrontDealAddress
                          ? setUpfrontDealTransferVestingModalPoolAddress(poolAddress)
                          : setTransferVestingModalPoolAddress(poolAddress)
                      }}
                      pool={item}
                    />
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        router.push(`/pool/${getKeyChainByValue(chainId)}/${poolAddress}`)
                      }}
                    >
                      See Pool
                    </Button>
                  </LinkCell>
                </Row>
              )
            })}
          </TableBody>
        </InfiniteScroll>
      </Wrapper>
      {transferVestingModalPoolAddress && (
        <TransferVestingShareModal
          onClose={() => setTransferVestingModalPoolAddress(null)}
          poolAddress={transferVestingModalPoolAddress}
        />
      )}
      {upfrontDealTransferVestingModalPoolAddress && (
        <UpfrontDealTransferVestingShareModal
          onClose={() => setUpfrontDealTransferVestingModalPoolAddress(null)}
          poolAddress={upfrontDealTransferVestingModalPoolAddress}
        />
      )}
    </>
  )
}

export default genericSuspense(VestDealTokens)

function AmountToVestCell({
  chainId,
  dealAddress,
  isDealTokenTransferable,
  isUpfrontDeal,
  poolAddress,
  tokenSymbol,
  underlyingDealTokenDecimals,
  vestingPeriodEnds,
  vestingPeriodStarts,
}: AmountToVestCellProps & {
  isUpfrontDeal: boolean
  dealAddress: string
}) {
  return isUpfrontDeal ? (
    <AmountToVestCellUpfrontDeal
      chainId={chainId}
      isDealTokenTransferable={isDealTokenTransferable}
      poolAddress={poolAddress}
      tokenSymbol={tokenSymbol}
      underlyingDealTokenDecimals={underlyingDealTokenDecimals}
      vestingPeriodEnds={vestingPeriodEnds}
      vestingPeriodStarts={vestingPeriodStarts}
    />
  ) : (
    <AmountToVestCellSponsorDeal
      chainId={chainId}
      dealAddress={dealAddress}
      isDealTokenTransferable={isDealTokenTransferable}
      poolAddress={poolAddress}
      tokenSymbol={tokenSymbol}
      underlyingDealTokenDecimals={underlyingDealTokenDecimals}
      vestingPeriodEnds={vestingPeriodEnds}
      vestingPeriodStarts={vestingPeriodStarts}
    />
  )
}

function AmountToVestCellSponsorDeal({
  chainId,
  dealAddress,
  isDealTokenTransferable,
  poolAddress,
  tokenSymbol,
  underlyingDealTokenDecimals,
  vestingPeriodEnds,
  vestingPeriodStarts,
}: AmountToVestCellProps & { dealAddress: string }) {
  const { address: userAddress } = useWeb3Connection()
  const now = new Date()
  const isVestingCliffEnded = isAfter(now, vestingPeriodStarts)
  const isVestindPeriodEnded = isAfter(now, vestingPeriodEnds)

  const withinInterval = isVestingCliffEnded && !isVestindPeriodEnded

  const { data: vestingTokensData } = useGetVestingTokens({
    chainId,
    where: {
      dealAddress,
      owner: userAddress,
    },
  })

  const tokenIds =
    vestingTokensData?.vestingTokens.map((vestingToken: any) => Number(vestingToken.tokenId)) ?? []

  const [amountToVest] = useAelinAmountToVest(
    isDealTokenTransferable,
    tokenIds,
    poolAddress,
    chainId,
    withinInterval,
  )

  return (
    <AmountToVestCellComponent
      amountToVest={amountToVest}
      tokenSymbol={tokenSymbol}
      underlyingDealTokenDecimals={underlyingDealTokenDecimals}
    />
  )
}

function AmountToVestCellUpfrontDeal({
  chainId,
  isDealTokenTransferable,
  poolAddress,
  tokenSymbol,
  underlyingDealTokenDecimals,
  vestingPeriodEnds,
  vestingPeriodStarts,
}: AmountToVestCellProps) {
  const { address: userAddress } = useWeb3Connection()
  const now = new Date()
  const isVestingCliffEnded = isAfter(now, vestingPeriodStarts)
  const isVestindPeriodEnded = isAfter(now, vestingPeriodEnds)

  const withinInterval = isVestingCliffEnded && !isVestindPeriodEnded

  const { data: vestingTokensData } = useGetVestingTokens({
    chainId,
    where: {
      dealAddress: poolAddress,
      owner: userAddress,
    },
  })

  const tokenIds =
    vestingTokensData?.vestingTokens.map((vestingToken: any) => Number(vestingToken.tokenId)) ?? []

  const [amountToVest] = useAelinAmountToVestUpfrontDeal(
    isDealTokenTransferable,
    tokenIds,
    poolAddress,
    chainId,
    withinInterval,
  )

  return (
    <AmountToVestCellComponent
      amountToVest={amountToVest}
      tokenSymbol={tokenSymbol}
      underlyingDealTokenDecimals={underlyingDealTokenDecimals}
    />
  )
}

function AmountToVestCellComponent({
  amountToVest,
  tokenSymbol,
  underlyingDealTokenDecimals,
}: AmountToVestCellComponentProps) {
  return (
    <Cell mobileJustifyContent="center">
      <HideOnDesktop>Amount to vest:&nbsp;</HideOnDesktop>
      <Value>
        {formatToken(amountToVest as BigNumber, underlyingDealTokenDecimals, DISPLAY_DECIMALS)}{' '}
        {tokenSymbol}
      </Value>
    </Cell>
  )
}

function TransferActionButton({
  onClick,
  pool,
}: {
  pool: ParsedVestingDeal
  onClick: (e: any) => void
}) {
  const { address: userAddress, isAppConnected } = useWeb3Connection()

  const { data: vestingTokensData } = useGetVestingTokens({
    chainId: pool.chainId,
    where: {
      dealAddress: pool.upfrontDealAddress ?? pool.dealAddress,
      owner: userAddress,
    },
    config: { refreshInterval: ms('5s') },
  })

  const tokenIds =
    vestingTokensData?.vestingTokens.map((vestingToken) => Number(vestingToken.tokenId)) ?? []

  const canTransfer =
    userAddress &&
    isAppConnected &&
    pool.isDealTokenTransferable &&
    tokenIds.length > 0 &&
    !isHiddenPool(pool.poolAddress)

  return <Button disabled={!canTransfer} onClick={onClick}></Button>
}
