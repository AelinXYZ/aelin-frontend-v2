import gql from 'graphql-tag'

export const DEAL_CREATED_BY_ID = gql`
  query dealById($dealAddress: ID!) {
    dealCreated(id: $dealAddress) {
      id
      name
      symbol
      poolAddress
      sponsor
    }
  }
`
