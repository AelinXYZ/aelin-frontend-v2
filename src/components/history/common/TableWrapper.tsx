import styled from 'styled-components'

import InfiniteScroll from 'react-infinite-scroll-component'

import {
  DealAccepted_OrderBy,
  DealFunded_OrderBy,
  DealSponsored_OrderBy,
  Deposit_OrderBy,
  OrderDirection,
} from '@/graphql-schema'
import { LoadingTableRow, TableHead } from '@/src/components/pureStyledComponents/common/Table'
import { SortableTH } from '@/src/components/table/SortableTH'

type OrderBy = any

type tableHeaderCellProps = {
  justifyContent?: string
  sortKey?: OrderBy
  title: string
}

type TableWrapper = {
  dataLength: number
  columns: any
  handleSort: (sortBy: OrderBy) => void
  hasMore: boolean
  nextPage: () => void
  order: {
    orderBy: OrderBy
    orderDirection: OrderDirection
  }
  tableHeaderCells: Array<tableHeaderCellProps>
}

export const TableCard = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const TableWrapper: React.FC<TableWrapper> = ({
  children,
  columns,
  dataLength,
  handleSort,
  hasMore,
  nextPage,
  order,
  tableHeaderCells,
}) => {
  return (
    <InfiniteScroll
      dataLength={dataLength}
      hasMore={hasMore}
      loader={<LoadingTableRow />}
      next={nextPage}
    >
      {!dataLength && (
        <TableHead columns={columns.widths}>
          {tableHeaderCells.map(
            ({ justifyContent, sortKey, title }: tableHeaderCellProps, index: number) => (
              <SortableTH
                isActive={order.orderBy === sortKey}
                justifyContent={justifyContent}
                key={index}
                onClick={() => {
                  if (sortKey) handleSort(sortKey)
                }}
              >
                {title}
              </SortableTH>
            ),
          )}
        </TableHead>
      )}
      {children}
    </InfiniteScroll>
  )
}
