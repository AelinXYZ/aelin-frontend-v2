import useSWR from 'swr'

import { Chains, ChainsValues, chainsConfig } from '@/src/constants/chains'
import { TestnetTokens, Token, TokenListResponse } from '@/src/constants/token'

const getTokenList = (chainId: ChainsValues) => {
  if (chainsConfig[chainId].isProd) {
    try {
      return fetch(chainsConfig[chainId].tokenListUrl[0]).then((x) => x.json())
    } catch (e) {
      console.error('error: ', e)
      if (chainsConfig[chainId].tokenListUrl.length >= 2) {
        return fetch(chainsConfig[chainId].tokenListUrl[1]).then((x) => x.json())
      } else {
        throw e
      }
    }
  } else {
    return Promise.resolve({ tokens: TestnetTokens[chainId] })
  }
}

const useTokenListQuery = (appChainId: ChainsValues) => {
  return useSWR(['token-list', appChainId], async () => {
    const response: TokenListResponse = await getTokenList(appChainId)

    if (appChainId === Chains.optimism || appChainId === Chains.arbitrum) {
      return response.tokens.filter(
        ({ chainId }: { chainId: number }) => Number(chainId) === appChainId,
      )
    }

    return response.tokens
  })
}

type UseAelinTokenListReturn = {
  tokens: Token[]
  tokensByAddress: { [address: string]: Token | undefined }
  tokensBySymbol: { [symbol: string]: Token | undefined }
}
const useAelinTokenList = (appChainId: ChainsValues) => {
  const tokenList = useTokenListQuery(appChainId)
  if (!tokenList.data && !tokenList.error) return undefined

  const allTokens = tokenList?.data ?? []
  const { tokens, tokensByAddress, tokensBySymbol } = allTokens.reduce(
    (acc: UseAelinTokenListReturn, token) => {
      const address = token.address.toLowerCase()
      if (acc.tokensByAddress[address]) {
        return acc
      }
      acc.tokens.push(token)
      acc.tokensByAddress[address] = token
      acc.tokensBySymbol[token.symbol.toLowerCase()] = token
      return acc
    },
    {
      tokens: [],
      tokensByAddress: {},
      tokensBySymbol: {},
    },
  )

  return { tokens, tokensByAddress, tokensBySymbol }
}

export default useAelinTokenList
