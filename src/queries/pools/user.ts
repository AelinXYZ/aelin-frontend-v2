import gql from 'graphql-tag'

export const USER_BY_ID_QUERY_NAME = 'userById'

export const USER_BY_ID = gql`
  query userById($userAddress: ID!) {
    user(id: $userAddress) {
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
      upfrontDealsAccepted {
        ...PoolDetails
      }
    }
  }
`
