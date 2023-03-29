import gql from 'graphql-tag'

export const INVESTORS_QUERY_NAME = 'investors'

export const INVESTORS = gql`
  query investors(
    $skip: Int
    $first: Int
    $orderBy: Investor_orderBy
    $orderDirection: OrderDirection
    $where: Investor_filter
    $block: Block_height
  ) {
    investors(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
      block: $block
    ) {
      amountInvested
      poolAddress
      userAddress
    }
  }
`
