import gql from 'graphql-tag'

export const DEAL_DETAILS_BY_ID = gql`
  query dealDetailsById($dealAddress: ID!) {
    dealDetail(id: $dealAddress) {
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
  }
`
