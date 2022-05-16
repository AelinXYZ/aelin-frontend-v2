import gql from 'graphql-tag'

export const VESTS_QUERY_NAME = 'vests'

export const VESTS = gql`
  query vests(
    $skip: Int
    $first: Int
    $orderBy: Vest_orderBy
    $orderDirection: OrderDirection
    $where: Vest_filter
  ) {
    vests(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      timestamp
      amountVested
      poolName
      pool {
        id
        deal {
          underlyingDealTokenSymbol
          underlyingDealTokenDecimals
        }
      }
    }
  }
`
