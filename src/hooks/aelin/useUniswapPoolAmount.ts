import { gql, request } from 'graphql-request'
import useSWR from 'swr'

type UniswapResponse = {
  pair: {
    reserve0: string
    reserve1: string
  }
}

export type UseUniswapPoolAmountResponse = {
  reserve0: string
  reserve1: string
}

const GRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
const PAIR_ID = '0x974d51fafc9013e42cbbb9465ea03fe097824bcc'

const query = gql`
  query getPair($id: String!) {
    pair(id: $id) {
      reserve0
      reserve1
    }
  }
`

const getUniswapPoolAmount = (): Promise<UniswapResponse> => {
  return request(GRAPH_ENDPOINT, query, {
    id: PAIR_ID,
  })
}

export const useUniswapPoolAmount = () => {
  return useSWR(['uniswapAelinPoolAmount'], async () => {
    const response: UniswapResponse = await getUniswapPoolAmount()

    const {
      pair: { reserve0, reserve1 },
    } = response

    return { reserve0, reserve1 }
  })
}
