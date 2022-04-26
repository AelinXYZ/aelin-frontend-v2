import gql from 'graphql-tag'

export const VESTING_DEALS_QUERY_NAME = 'vestingDeals'

export const VESTING_DEALS = gql`
  query vestingDeals(
    $orderBy: VestingDeal_orderBy
    $orderDirection: OrderDirection
    $where: VestingDeal_filter
  ) {
    vestingDeals(orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      poolName
      tokenToVest
      tokenToVestSymbol
      investorDealTotal
      amountToVest
      totalVested
      vestingPeriodEnds
      vestingPeriodStarts
      underlyingDealTokenDecimals
      poolAddress
    }
  }
`
