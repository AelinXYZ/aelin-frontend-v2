import gql from 'graphql-tag'

export const DEPOSITS_QUERY_NAME = 'deposits'

export const DEPOSITS = gql`
  query deposits(
    $skip: Int
    $first: Int
    $orderBy: Deposit_orderBy
    $orderDirection: OrderDirection
    $where: Deposit_filter
  ) {
    deposits(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      userAddress
      timestamp
      amountDeposited
      pool {
        id
        name
        sponsor
        purchaseTokenSymbol
        purchaseTokenDecimals
      }
    }
  }
`
