import { Dispatch, ReactNode, createContext, useContext, useReducer } from 'react'

import {
  NftWhiteListAction,
  NftWhiteListState,
  initialState,
  nftWhiteListReducer,
} from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'

type NftCreationReducerContext = {
  nftWhiteListState: NftWhiteListState
  dispatch: Dispatch<NftWhiteListAction>
}

const NftCreationContext = createContext<NftCreationReducerContext>({
  nftWhiteListState: initialState,
  dispatch: () => null,
})

const NftCreationContextProvider = ({ children }: { children: ReactNode }) => {
  const [nftWhiteListState, dispatch] = useReducer(nftWhiteListReducer, initialState)

  return (
    <NftCreationContext.Provider
      value={{
        nftWhiteListState,
        dispatch,
      }}
    >
      {children}
    </NftCreationContext.Provider>
  )
}

export default NftCreationContextProvider

export function useNftCreationState(): NftCreationReducerContext {
  const context = useContext<NftCreationReducerContext>(NftCreationContext)

  if (!context) {
    throw new Error('Error on nft creation context')
  }

  return context
}
