import gql from 'graphql-tag'

export const DEALS_ACCEPTED_QUERY_NAME = 'dealAccepteds'

export const DEALS_ACCEPTED = gql`
  query dealAccepteds(
    $skip: Int
    $first: Int
    $orderBy: DealAccepted_orderBy
    $orderDirection: OrderDirection
    $where: DealAccepted_filter
  ) {
    dealAccepteds(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      userAddress
      timestamp
      investmentAmount
      dealTokenAmount
      pool {
        id
        name
        sponsor
        purchaseTokenSymbol
        purchaseTokenDecimals
        deal {
          underlyingDealTokenDecimals
          underlyingDealTokenSymbol
        }
      }
    }
  }
`
