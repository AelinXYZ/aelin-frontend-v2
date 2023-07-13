import { gql, request } from 'graphql-request'

export type AelinRatesResponse = {
  aelin: { usd: number }
  ethereum: { usd: number }
}

export type UniswapResponse = {
  pair: {
    reserve0: string
    reserve1: string
  }
}

export const getAelinETHRates = (): Promise<AelinRatesResponse> => {
  return fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=aelin%2Cethereum&vs_currencies=usd`,
  ).then((r) => r.json())
}

const GRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v2-dev'
const PAIR_ID = '0x974d51fafc9013e42cbbb9465ea03fe097824bcc'

const query = gql`
  query getPair($id: String!) {
    pair(id: $id) {
      reserve0
      reserve1
    }
  }
`

export const getUniswapPoolAmount = (): Promise<UniswapResponse> => {
  return request(GRAPH_ENDPOINT, query, {
    id: PAIR_ID,
  })
}
