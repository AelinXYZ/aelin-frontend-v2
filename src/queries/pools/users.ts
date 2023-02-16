import gql from 'graphql-tag'

export const USERS_QUERY_NAME = 'users'

export const USERS = gql`
  query users(
    $skip: Int
    $first: Int
    $orderBy: User_orderBy
    $orderDirection: OrderDirection
    $where: User_filter
    $block: Block_height
    $whereDeposits: Deposit_filter
  ) {
    users(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
      block: $block
    ) {
      id
      poolsInvestedAmt
      poolsVouchedAmt
      poolsAsHolderAmt
      poolsSponsoredAmt
      dealsAcceptedAmt
      upfrontDealsAcceptedAmt
      history {
        deposits(where: $whereDeposits) {
          amountDeposited
          pool {
            id
            purchaseTokenDecimals
            purchaseTokenSymbol
          }
        }
      }
    }
  }
`
