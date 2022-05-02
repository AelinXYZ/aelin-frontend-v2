import gql from 'graphql-tag'

export const USER_ALLOCATION_STAT = gql`
  query UserAllocationStat($id: ID!) {
    userAllocationStat(id: $id) {
      totalWithdrawn
      totalAccepted
      poolTokenBalance
    }
  }
`
