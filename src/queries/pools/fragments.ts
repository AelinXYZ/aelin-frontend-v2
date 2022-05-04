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
    dealsCreated

    totalAmountEarnedBySponsor
    totalAmountAccepted
    totalAmountWithdrawn
    totalAmountFunded
  }
`

gql`
  fragment PoolDeal on Deal {
    id
    name
    symbol
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
    vestingPeriodStarts

    holder
    isDealFunded
    holderFundingExpiration
    holderFundingDuration
  }
`
