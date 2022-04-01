import useSWR from 'swr'

import { Chains, ChainsValues, chainsConfig } from '@/src/constants/chains'
import { TestnetTokens, Token, TokenListResponse } from '@/src/constants/token'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import isDev from '@/src/utils/isDev'

const getTokenList = (chainId: ChainsValues) => {
  if (!isDev) {
    return fetch(chainsConfig[chainId].tokenListUrl).then((x) => x.json())
  } else {
    return new Promise((resolve) => resolve({ tokens: [TestnetTokens[chainId]] }))
  }
}

const useTokenListQuery = () => {
  const { appChainId } = useWeb3Connection()
  return useSWR(['tokenList', appChainId], async () => {
    const response: TokenListResponse = await getTokenList(appChainId)
    let tokens: Token[] = response.tokens

    if (appChainId === Chains.optimism) {
      tokens = response.tokens.filter(
        ({ chainId }: { chainId: number }) => Number(chainId) === Chains.optimism,
      )
    }

    return tokens
  })
}

type UseAelinTokenListReturn = {
  tokens: Token[]
  tokensByAddress: { [address: string]: Token | undefined }
}
const useAelinTokenList = () => {
  const tokenList = useTokenListQuery()
  if (!tokenList.data && !tokenList.error) return undefined

  const allTokens = tokenList?.data ?? []
  const { tokens, tokensByAddress } = allTokens.reduce(
    (acc: UseAelinTokenListReturn, token) => {
      const address = token.address.toLowerCase()
      if (acc.tokensByAddress[address]) {
        return acc
      }
      acc.tokens.push(token)
      acc.tokensByAddress[address] = token
      return acc
    },
    {
      tokens: [],
      tokensByAddress: {},
    },
  )

  return { tokens, tokensByAddress }
}

export default useAelinTokenList
