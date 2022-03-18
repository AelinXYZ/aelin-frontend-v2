import gql from 'graphql-tag'

export const POOLS_CREATED = gql`
  query poolsCreated(
    $orderBy: PoolCreated_orderBy
    $orderDirection: OrderDirection
    $where: PoolCreated_filter
  ) {
    poolCreateds(orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      ...PoolDetails
    }
  }
`
