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
      pool {
        id
        name
        deal {
          underlyingDealTokenSymbol
          underlyingDealTokenDecimals
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
