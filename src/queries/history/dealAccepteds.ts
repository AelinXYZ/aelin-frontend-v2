import gql from 'graphql-tag'

export const DEAL_ACCEPTEDS_QUERY_NAME = 'dealAccepteds'

export const DEAL_ACCEPTEDS = gql`
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

/**
  
 {
	  "where": {
      "userAddress": "0xa834e550B45B4a469a05B846fb637bfcB12e3Df8"
    }
  }
 */
