import gql from 'graphql-tag'

export const VESTING_DEALS_QUERY_NAME = 'vestingDeals'

export const VESTING_DEALS = gql`
  query vestingDeals(
    $skip: Int
    $first: Int
    $orderBy: VestingDeal_orderBy
    $orderDirection: OrderDirection
    $where: VestingDeal_filter
  ) {
    vestingDeals(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      poolName
      tokenToVest
      tokenToVestSymbol
      investorDealTotal
      remainingAmountToVest
      totalVested
      vestingPeriodEnds
      vestingPeriodStarts
      underlyingDealTokenDecimals
      poolAddress
      lastClaim
      pool {
        dealAddress
        isDealTokenTransferable
        upfrontDeal {
          id
        }
      }
    }
  }
`
