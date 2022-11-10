import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { noop } from 'lodash'
import cloneDeep from 'lodash/cloneDeep'

import { Chains } from '@/src/constants/chains'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
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
  [StakingEnum.UNISWAP]: UniswapStakingResponse | null
  [StakingEnum.GELATO]: GelatoStakingResponse | null
  [StakingEnum.AELIN]: AelinStakingResponse | null
}

export type StakingRewardsContextType = {
  handleAfterClaim: (stakeType: StakingEnum) => void
  handleAfterWithdraw: (stakeType: StakingEnum, amount: BigNumber) => void
  handleAfterDeposit: (stakeType: StakingEnum, amount: BigNumber) => void
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
      [Chains.optimism]: async () => {
        try {
          setIsLoading(true)

          const aelinRewards = await getAelinStakingRewards({
            address: address || ZERO_ADDRESS,
            chainId: Chains.optimism,
          })

          const gelatoRewards = await getGelatoStakingRewards({
            address: address || ZERO_ADDRESS,
            chainId: Chains.optimism,
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
      [Chains.mainnet]: async () => {
        try {
          setIsLoading(true)

          const uniswapRewards = await getUniswapStakingRewards({
            address: address || ZERO_ADDRESS,
            chainId: Chains.mainnet,
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
      [Chains.goerli]: () => {
        const error = new Error(`Staking Rewards isn't available on Network Id = ${Chains.goerli}`)

        setError(error)
      },
      [Chains.arbitrum]: () => {
        noop()
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

  const handleAfterClaim = (stakeType: StakingEnum) => {
    const rewards = cloneDeep(data[stakeType])

    if (!rewards) return

    rewards.userRewards = ZERO_BN

    setData((prevState) => ({
      ...prevState,
      [stakeType]: rewards,
    }))
  }

  return (
    <StakingRewardsContext.Provider
      value={{
        handleAfterClaim,
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
