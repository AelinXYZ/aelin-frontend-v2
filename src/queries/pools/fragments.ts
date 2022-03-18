import gql from 'graphql-tag'

gql`
  fragment PoolDetails on PoolCreated {
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
    dealAddress
    hasAllowList
    poolStatus
    contributions
    totalSupply
  }
`
