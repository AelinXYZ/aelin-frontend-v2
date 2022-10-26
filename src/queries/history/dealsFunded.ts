import gql from 'graphql-tag'

export const DEALS_FUNDED_QUERY_NAME = 'dealFundeds'

export const DEALS_FUNDED = gql`
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
        upfrontDeal {
          underlyingDealTokenDecimals
          underlyingDealTokenSymbol
        }
      }
    }
  }
`
