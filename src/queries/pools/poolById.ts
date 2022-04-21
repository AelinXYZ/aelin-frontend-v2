import gql from 'graphql-tag'

export const POOL_CREATED_BY_ID = gql`
  query poolById($poolCreatedId: ID!) {
    poolCreated(id: $poolCreatedId) {
      ...PoolDetails
      deal {
        ...PoolDeal
      }
    }
  }
`
