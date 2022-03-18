import gql from 'graphql-tag'

export const POOLS_CREATED_QUERY_NAME = 'poolsCreated'

export const POOLS_CREATED = gql`
  query poolsCreated(
    $skip: Int
    $first: Int
    $orderBy: PoolCreated_orderBy
    $orderDirection: OrderDirection
    $where: PoolCreated_filter
    $block: Block_height
  ) {
    poolCreateds(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
      block: $block
    ) {
      ...PoolDetails
    }
  }
`
