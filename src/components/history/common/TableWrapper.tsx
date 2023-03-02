import styled from 'styled-components'

import InfiniteScroll from 'react-infinite-scroll-component'

import { OrderDirection } from '@/graphql-schema'
import { LoadingTableRow, TableHead } from '@/src/components/pureStyledComponents/common/Table'
import { SortableTH } from '@/src/components/table/SortableTH'

type tableHeaderCellProps = {
  justifyContent?: string
  sortKey?: any
  title: string
}

type TableWrapper = {
  dataLength: number
  columns: any
  handleSort: (sortBy: any) => void
  hasMore: boolean
  nextPage: () => void
  order: {
    orderBy: any
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

export const Text = styled.h3`
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.2;
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
      {!!dataLength && (
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
