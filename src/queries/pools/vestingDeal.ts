import gql from 'graphql-tag'

export const VESTING_DEALS_QUERY_NAME = 'vestingDeals'

export const VESTING_DEALS = gql`
  query vestingDealById($id: ID!) {
    vestingDeal(id: $id) {
      tokenToVestSymbol
      remainingAmountToVest
      totalVested
      underlyingDealTokenDecimals
      lastClaim
    }
  }
`
