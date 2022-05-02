import gql from 'graphql-tag'

export const WITHDRAWS_QUERY_NAME = 'withdraws'

export const WITHDRAWS = gql`
  query withdraws(
    $skip: Int
    $first: Int
    $orderBy: Withdraw_orderBy
    $orderDirection: OrderDirection
    $where: Withdraw_filter
  ) {
    withdraws(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      timestamp
      amountWithdrawn
      pool {
        id
        name
        purchaseTokenSymbol
        purchaseTokenDecimals
      }
    }
  }
`
