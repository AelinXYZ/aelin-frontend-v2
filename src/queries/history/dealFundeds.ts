import gql from 'graphql-tag'

export const DEAL_FUNDEDS_QUERY_NAME = 'dealFundeds'

export const DEAL_FUNDEDS = gql`
  query dealFundeds(
    $skip: Int
    $first: Int
    $orderBy: DealFunded_orderBy
    $orderDirection: OrderDirection
    $where: DealFunded_filter
  ) {
    dealFundeds(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      holder
      timestamp
      amountRaised
      amountFunded
      pool {
        id
        name
        purchaseTokenDecimals
        purchaseTokenSymbol
        deal {
          underlyingDealTokenSymbol
          underlyingDealTokenDecimals
        }
      }
    }
  }
`
