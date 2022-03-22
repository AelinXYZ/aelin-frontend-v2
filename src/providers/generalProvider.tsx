import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'

export type GeneralContextType = {
  title?: string
  setTitle: Dispatch<SetStateAction<GeneralContextType['title']>>
  resetTitle: () => void
}

const GeneralContext = createContext<GeneralContextType>({} as any)

const GeneralContextProvider: React.FC = ({ children }) => {
  const [title, setTitle] = useState<GeneralContextType['title']>()

  return (
    <GeneralContext.Provider
      value={{
        title,
        setTitle,
        resetTitle: () => {
          setTitle(undefined)
        },
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
