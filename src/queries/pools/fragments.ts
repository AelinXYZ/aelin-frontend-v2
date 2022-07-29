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
    totalUsersInvested

    vestingEnds
    vestingStarts
    holder

    filter

    hasNftList
    nftCollectionRules {
      ...NftCollectionRuleDetails
    }
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
    totalUsersAccepted
    totalUsersRejected
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

gql`
  fragment NftCollectionRuleDetails on NftCollectionRule {
    id
    poolAddress
    nftType
    collectionAddress
    purchaseAmount
    purchaseAmountPerToken
    erc1155TokenIds
    erc721Blacklisted
    erc1155TokensAmtEligible
  }
`
