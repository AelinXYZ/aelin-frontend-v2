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
      poolsInvested {
        ...PoolDetails
      }
      poolsSponsored {
        ...PoolDetails
      }
      poolsAsHolder {
        ...PoolDetails
      }
      dealsAccepted {
        ...DealAcceptedDetails
      }
    }
  }
`
