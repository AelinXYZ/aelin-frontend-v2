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

    totalAmountAccepted
    totalAmountWithdrawn
    totalAmountFunded
  }
`

gql`
  fragment PoolDealDetail on DealDetail {
    id
    underlyingDealToken
    underlyingDealTokenSymbol
    underlyingDealTokenDecimals
    underlyingDealTokenTotalSupply
    underlyingDealTokenTotal

    purchaseTokenTotalForDeal

    proRataRedemptionPeriod
    proRataRedemptionPeriodStart

    openRedemptionPeriod

    vestingPeriod
    vestingCliff

    holder
    isDealFunded
    holderFundingExpiration
    holderFundingDuration
  }
`
