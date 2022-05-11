import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import cloneDeep from 'lodash/cloneDeep'

import { ZERO_ADDRESS } from '@/src/constants/misc'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import {
  AelinStakingResponse,
  getAelinStakingRewards,
} from '@/src/utils/stake/getAelinStakingRewards'
import {
  GelatoStakingResponse,
  getGelatoStakingRewards,
} from '@/src/utils/stake/getGelatoStakingRewards'
import {
  UniswapStakingResponse,
  getUniswapStakingRewards,
} from '@/src/utils/stake/getUniswapStakingRewards'

export enum StakingEnum {
  UNISWAP = 'UNISWAP',
  GELATO = 'GELATO',
  AELIN = 'AELIN',
}

export type StakingType = {
  [StakingEnum.UNISWAP]: UniswapStakingResponse
  [StakingEnum.GELATO]: GelatoStakingResponse
  [StakingEnum.AELIN]: AelinStakingResponse
}

export type StakingRewardsContextType = {
  handleAfterWithdraw: (stakeType: StakingEnum, amount: BigNumber) => void
  handleAfterDeposit: (stakeType: StakingEnum, amount: BigNumber) => void
  clear: () => void
  data: StakingType
  error: Error | null
  isLoading: boolean
}

const initialState = {
  [StakingEnum.UNISWAP]: null,
  [StakingEnum.GELATO]: null,
  [StakingEnum.AELIN]: null,
}

const StakingRewardsContext = createContext<StakingRewardsContextType>({} as any)

const StakingRewardsContextProvider: React.FC = ({ children }) => {
  const { address, appChainId } = useWeb3Connection()
  const [data, setData] = useState<StakingRewardsContextType['data']>(initialState)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const stakingRewardsPerChain = useMemo(
    () => ({
      10: async () => {
        try {
          setIsLoading(true)

          const aelinRewards = await getAelinStakingRewards({
            address: address || ZERO_ADDRESS,
            chainId: 10,
          })

          const gelatoRewards = await getGelatoStakingRewards({
            address: address || ZERO_ADDRESS,
            chainId: 10,
          })

          setData((prevState) => ({
            ...prevState,
            [StakingEnum.GELATO]: gelatoRewards,
            [StakingEnum.AELIN]: aelinRewards,
          }))

          setIsLoading(false)
        } catch (error) {
          setIsLoading(false)

          if (error instanceof Error) {
            setError(error)
          }
        }
      },
      1: async () => {
        try {
          setIsLoading(true)

          const uniswapRewards = await getUniswapStakingRewards({
            address: address || ZERO_ADDRESS,
            chainId: 1,
          })

          setData((prevState) => ({
            ...prevState,
            [StakingEnum.UNISWAP]: uniswapRewards,
          }))

          setIsLoading(false)
        } catch (error) {
          setIsLoading(false)

          if (error instanceof Error) {
            setError(error)
          }
        }
      },
      5: () => {
        const error = new Error(`Staking Rewards isn't available on Network Id = 5`)

        setError(error)
      },
      42: () => {
        const error = new Error(`Staking Rewards isn't available on Network Id = 42`)

        setError(error)
      },
    }),
    [address],
  )

  useEffect(() => {
    if (appChainId === null) return

    stakingRewardsPerChain[appChainId]()
  }, [address, appChainId, stakingRewardsPerChain])

  const handleAfterDeposit = (stakeType: StakingEnum, amount: BigNumber) => {
    const rewards = cloneDeep(data[stakeType])

    if (!rewards) return

    rewards.userStake = rewards.userStake.add(amount)

    if ('totalStakedBalance' in rewards) {
      rewards.totalStakedBalance = rewards.totalStakedBalance.add(amount)
    }

    setData((prevState) => ({
      ...prevState,
      [stakeType]: rewards,
    }))
  }

  const handleAfterWithdraw = (stakeType: StakingEnum, amount: BigNumber) => {
    const rewards = cloneDeep(data[stakeType])

    if (!rewards) return

    rewards.userStake = rewards.userStake.sub(amount)

    if ('totalStakedBalance' in rewards) {
      rewards.totalStakedBalance = rewards.totalStakedBalance.sub(amount)
    }

    setData((prevState) => ({
      ...prevState,
      [stakeType]: rewards,
    }))
  }

  const clear = () => {
    setData(initialState)
  }

  return (
    <StakingRewardsContext.Provider
      value={{
        clear,
        handleAfterDeposit,
        handleAfterWithdraw,
        isLoading,
        error,
        data,
      }}
    >
      {children}
    </StakingRewardsContext.Provider>
  )
}

export default StakingRewardsContextProvider

export function useStakingRewards(): StakingRewardsContextType {
  return useContext<StakingRewardsContextType>(StakingRewardsContext)
}
