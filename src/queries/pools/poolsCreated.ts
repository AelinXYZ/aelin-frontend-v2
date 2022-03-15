import gql from 'graphql-tag'

export const POOLS_CREATED = gql`
  query poolsCreated(
    $orderBy: PoolCreated_orderBy
    $orderDirection: OrderDirection
    $where: PoolCreated_filter
  ) {
    poolCreateds(orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      name
      symbol
      purchaseTokenCap
      purchaseToken
      purchaseTokenSymbol
      duration
      sponsorFee
      sponsor
      purchaseDuration
      purchaseExpiry
      purchaseTokenDecimals
      timestamp
      hasAllowList
      poolStatus
      contributions
      totalSupply
      dealAddress
    }
  }
`
