import { createContext, useContext } from 'react'

import { Chains } from '../constants/config/chains'
import { Token } from '../constants/token'
import useAelinTokenList from '../hooks/aelin/useAelinTokenList'

export type TokenIconsContextType = {
  tokens: {
    [symbol: string]: Token | undefined
  }
}

const TokenIconsContext = createContext<TokenIconsContextType>({} as any)

const TokenIconsContextProvider: React.FC = ({ children }) => {
  const { tokensBySymbol = {} } = useAelinTokenList(Chains.mainnet) || {}

  return (
    <TokenIconsContext.Provider value={{ tokens: tokensBySymbol }}>
      {children}
    </TokenIconsContext.Provider>
  )
}

export default TokenIconsContextProvider

export function useTokenIcons(): TokenIconsContextType {
  return useContext<TokenIconsContextType>(TokenIconsContext)
}
