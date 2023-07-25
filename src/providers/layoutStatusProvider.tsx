import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

export enum MyPoolsFilter {
  Invested = 'Invested',
  Sponsored = 'Sponsored',
  Funded = 'Funded',
}

export type LayoutStatusContextType = {
  sidebar: {
    myPools: {
      activeFilter: MyPoolsFilter
      setActiveFilter: Dispatch<SetStateAction<MyPoolsFilter>>
      filtersExpansion: Record<MyPoolsFilter, boolean>
      setFiltersExpansion: Dispatch<SetStateAction<Record<MyPoolsFilter, boolean>>>
    }
  }
}

const LayoutStatusContext = createContext<LayoutStatusContextType>({} as LayoutStatusContextType)

const LayoutStatusContextProvider = ({ children }: { children: ReactNode }) => {
  const [activeMyPoolsFilter, setActiveMyPoolsFilter] = useState<MyPoolsFilter>(
    MyPoolsFilter.Invested,
  )
  const [myPoolsFiltersExpansion, setMyPoolsFiltersExpansion] = useState<
    Record<MyPoolsFilter, boolean>
  >({
    [MyPoolsFilter.Invested]: false,
    [MyPoolsFilter.Sponsored]: false,
    [MyPoolsFilter.Funded]: false,
  })

  return (
    <LayoutStatusContext.Provider
      value={{
        sidebar: {
          myPools: {
            activeFilter: activeMyPoolsFilter,
            setActiveFilter: setActiveMyPoolsFilter,
            filtersExpansion: myPoolsFiltersExpansion,
            setFiltersExpansion: setMyPoolsFiltersExpansion,
          },
        },
      }}
    >
      {children}
    </LayoutStatusContext.Provider>
  )
}

export default LayoutStatusContextProvider

export function useLayoutStatus(): LayoutStatusContextType {
  return useContext<LayoutStatusContextType>(LayoutStatusContext)
}
