import { useRouter } from 'next/router'
import { useState } from 'react'

import InfiniteScroll from 'react-infinite-scroll-component'

import { Deadline } from '../common/Deadline'
import { OrderDirection, VestingDeal_OrderBy } from '@/graphql-schema'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonPrimaryLightSm } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import {
  Cell,
  LinkCell,
  Row,
  Table,
  TableHead,
  TableWrapper,
} from '@/src/components/pureStyledComponents/common/Table'
import { SortableTH } from '@/src/components/table/SortableTH'
import { getKeyChainByValue } from '@/src/constants/chains'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import useAelinVestingDeals from '@/src/hooks/aelin/useAelinVestingDeals'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { calculateInvestmentDeadlineProgress as calculateVestingDealLineProgress } from '@/src/utils/aelinPoolUtils'
import { getFormattedDurationFromDateToNow } from '@/src/utils/date'

type Order = {
  orderBy: VestingDeal_OrderBy
  orderDirection: OrderDirection
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
    widths: '120px 120px 120px 120px 120px 150px 1fr',
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
      sortKey: VestingDeal_OrderBy.AmountToVest,
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

  const handleVest = () => {
    mutate()
  }
  return (
    <TableWrapper {...restProps}>
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
                amountToVest,
                chainId,
                myDealTotal,
                poolAddress,
                poolName,
                tokenToVest,
                totalVested,
                vestingPeriodEnds,
                vestingPeriodStarts,
              } = item

              return (
                <Row columns={columns.widths} hasHover key={index}>
                  <Cell>{poolName}</Cell>
                  <Cell light>{tokenToVest}</Cell>
                  <Cell light>{myDealTotal}</Cell>
                  <Cell light>{amountToVest}</Cell>
                  <Cell light>{totalVested}</Cell>
                  <Deadline
                    progress={calculateVestingDealLineProgress(
                      vestingPeriodEnds,
                      vestingPeriodStarts,
                    )}
                  >
                    {getFormattedDurationFromDateToNow(vestingPeriodEnds, 'ended')}
                  </Deadline>
                  <LinkCell justifyContent={columns.alignment.seePool} light>
                    <ButtonPrimaryLightSm onClick={handleVest}>Vest</ButtonPrimaryLightSm>
                    <ButtonPrimaryLightSm
                      onClick={() => {
                        router.push(`/pool/${getKeyChainByValue(chainId)}/${poolAddress}`)
                      }}
                    >
                      See Pool
                    </ButtonPrimaryLightSm>
                  </LinkCell>
                </Row>
              )
            })
          )}
        </InfiniteScroll>
      </Table>
    </TableWrapper>
  )
}

export default genericSuspense(VestDealTokens)
