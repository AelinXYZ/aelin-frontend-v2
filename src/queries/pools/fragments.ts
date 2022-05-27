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
    holder
    filter

    totalAmountEarnedBySponsor
    totalAmountAccepted
    totalAmountWithdrawn
    totalAmountFunded

    vestingEnds
    vestingStarts
    holder

    filter
  }
`

gql`
  fragment PoolDeal on Deal {
    id
    name
    symbol
    poolAddress
    underlyingDealToken
    underlyingDealTokenSymbol
    underlyingDealTokenDecimals
    underlyingDealTokenTotalSupply
    underlyingDealTokenTotal

    purchaseTokenTotalForDeal

    proRataRedemptionPeriod
    proRataRedemptionPeriodStart
    openRedemptionPeriod
    openRedemptionStart

    vestingPeriod
    vestingCliff
    vestingPeriodStarts

    holder
    isDealFunded
    holderFundingExpiration
    holderFundingDuration
    timestamp
    dealFundedAt
    totalAmountUnredeemed
  }
`

gql`
  fragment NotificationDetails on Notification {
    id
    type
    message
    pool {
      ...PoolDetails
      deal {
        ...PoolDeal
      }
    }
    triggerStart
    triggerEnd
    target
  }
`

gql`
  fragment DealAcceptedDetails on DealAccepted {
    id
    userAddress
    timestamp
    poolName
    investmentAmount
    dealTokenAmount
    pool {
      ...PoolDetails
      deal {
        ...PoolDeal
      }
    }
  }
`
