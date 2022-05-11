import { useRouter } from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'

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
  LinkCell,
  Row,
  RowLink,
  Table,
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

const TableCard = styled(BaseCard)`
  padding: 40px 50px;
`

const Cell = styled(BaseCell)`
  font-weight: 400;
`

const Title = styled(BaseTitle)`
  margin-bottom: 20px;
`

type Order = {
  orderBy: VestingDeal_OrderBy
  orderDirection: OrderDirection
}

const VestActionButton = ({
  dealAddress,
  disabled,
  mutate,
}: {
  disabled: boolean
  dealAddress: string
  mutate: () => void
}) => {
  const vestTokens = useAelinDealTransaction(dealAddress, 'claim')
  const handleVestTokens = async () => {
    await vestTokens()
    mutate()
  }

  return (
    <GradientButtonSm
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault()
        handleVestTokens()
      }}
    >
      Vest
    </GradientButtonSm>
  )
}

const AmountToVestCell = ({ ...item }: ParsedVestingDeal) => {
  const { chainId, myDealTotal, poolAddress, totalVested } = item
  const amountToVest = useAelinClaimableTokens(poolAddress, chainId, myDealTotal, totalVested)

  return <Cell>{formatNumber(amountToVest)}</Cell>
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

  return (
    <TableCard {...restProps}>
      <Title>Vest Deal Tokens</Title>
      <TableWrapper>
        <Table>
          <InfiniteScroll
            dataLength={data?.length}
            hasMore={hasMore}
            loader={
              <Row columns={'1fr'}>
                <Cell justifyContent="center">Loading...</Cell>
              </Row>
            }
            next={nextPage}
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
            {!data?.length ? (
              <BaseCard>No data.</BaseCard>
            ) : (
              data.map((item, index) => {
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
                    <NameCell name={poolName} />
                    <Cell>{tokenToVest}</Cell>
                    <Cell>{myDealTotal}</Cell>
                    <AmountToVestCell {...item} />
                    <Cell>{totalVested}</Cell>
                    <Deadline
                      progress={calculateVestingDealLineProgress(
                        vestingPeriodEnds,
                        vestingPeriodStarts,
                      )}
                    >
                      {getFormattedDurationFromDateToNow(vestingPeriodEnds, 'ended')}
                    </Deadline>
                    <LinkCell justifyContent={columns.alignment.seePool} light>
                      <VestActionButton
                        dealAddress={dealAddress}
                        disabled={!canVest}
                        mutate={mutate}
                      />
                      <ButtonPrimaryLightSm
                        onClick={(e) => {
                          e.preventDefault()
                          router.push(`/pool/${getKeyChainByValue(chainId)}/${poolAddress}`)
                        }}
                      >
                        See Pool
                      </ButtonPrimaryLightSm>
                    </LinkCell>
                  </RowLink>
                )
              })
            )}
          </InfiniteScroll>
        </Table>
      </TableWrapper>
    </TableCard>
  )
}

export default genericSuspense(VestDealTokens)
