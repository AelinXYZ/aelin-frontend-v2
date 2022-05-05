import gql from 'graphql-tag'

export const DEAL_BY_ID = gql`
  query dealsById($dealAddress: ID!) {
    deal(id: $dealAddress) {
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
      vestingPeriodStarts

      holder
      isDealFunded
      holderFundingExpiration
      holderFundingDuration
    }
  }
`
