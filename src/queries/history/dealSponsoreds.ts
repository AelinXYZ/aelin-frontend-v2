import gql from 'graphql-tag'

export const DEAL_SPONSOREDS_QUERY_NAME = 'dealSponsoreds'

export const DEAL_SPONSOREDS = gql`
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
