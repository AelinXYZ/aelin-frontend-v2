import gql from 'graphql-tag'

export const POOL_CREATED_BY_ID = gql`
  query poolById($poolCreatedId: ID!) {
    poolCreated(id: $poolCreatedId) {
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
