import gql from 'graphql-tag'

export const VESTING_TOKENS = gql`
  query vestingTokens(
    $skip: Int
    $first: Int
    $orderBy: VestingToken_orderBy
    $orderDirection: OrderDirection
    $where: VestingToken_filter
    $block: Block_height
  ) {
    vestingTokens(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
      block: $block
    ) {
      id
      dealAddress
      tokenId
      owner
      amount
      timestamp
    }
  }
`
