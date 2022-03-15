import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'

import { SdkWithHooks } from '@/graphql-schema'
import { ChainsValues } from '@/src/constants/chains'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'

export type GeneralContextType = {
  title?: string
  setTitle: Dispatch<SetStateAction<GeneralContextType['title']>>
  resetTitle: () => void
  queriesSDK: Record<ChainsValues, SdkWithHooks>
}

const GeneralContext = createContext<GeneralContextType>({} as any)

const GeneralContextProvider: React.FC = ({ children }) => {
  const [title, setTitle] = useState<GeneralContextType['title']>()
  const queriesSDK = getAllGqlSDK()

  return (
    <GeneralContext.Provider
      value={{
        title,
        setTitle,
        resetTitle: () => {
          setTitle(undefined)
        },
        // SDK queries to provide to the entire app with the queries and queries hooks
        queriesSDK: queriesSDK as Record<ChainsValues, SdkWithHooks>,
      }}
    >
      {children}
    </GeneralContext.Provider>
  )
}

export default GeneralContextProvider

export function useGeneral(): GeneralContextType {
  return useContext<GeneralContextType>(GeneralContext)
}
