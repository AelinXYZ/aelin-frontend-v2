import gql from 'graphql-tag'

export const DEALS_SPONSORED_QUERY_NAME = 'dealSponsoreds'

export const DEALS_SPONSORED = gql`
  query dealSponsoreds(
    $skip: Int
    $first: Int
    $orderBy: DealSponsored_orderBy
    $orderDirection: OrderDirection
    $where: DealSponsored_filter
  ) {
    dealSponsoreds(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      timestamp
      amountEarned
      totalAccepted
      totalInvested
      pool {
        id
        name
        purchaseTokenSymbol
        purchaseTokenDecimals
        sponsorFee
        deal {
          underlyingDealTokenSymbol
          underlyingDealTokenDecimals
        }
      }
    }
  }
`
