import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react'

import { Chains } from '@/src/constants/chains'
import { StakingEnum } from '@/src/providers/stakingRewardsProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

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
    staking: {
      activeTab: StakingEnum
      setActiveTab: Dispatch<SetStateAction<StakingEnum>>
    }
  }
}

const LayoutStatusContext = createContext<LayoutStatusContextType>({} as any)

const LayoutStatusContextProvider: React.FC = ({ children }) => {
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

  const [activeStakingTab, setActiveStakingTab] = useState<StakingEnum>(StakingEnum.AELIN)

  const { appChainId } = useWeb3Connection()
  const isMainnet = Chains.mainnet === appChainId

  useEffect(() => {
    const activeTab = isMainnet ? StakingEnum.UNISWAP : StakingEnum.AELIN

    setActiveStakingTab(activeTab)
  }, [isMainnet])

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
          staking: { activeTab: activeStakingTab, setActiveTab: setActiveStakingTab },
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
