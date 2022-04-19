import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import Wei from '@synthetixio/wei'

import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ONE_YEAR_IN_SECS } from '@/src/constants/time'
import { UseCoingeckoRatesResponse, useCoingeckoRates } from '@/src/hooks/aelin/useCoingeckoRates'
import {
  UseUniswapPoolAmountResponse,
  useUniswapPoolAmount,
} from '@/src/hooks/aelin/useUniswapPoolAmount'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import useStakingRewardsCall from '@/src/hooks/contracts/useStakingRewardsCall'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

interface UseUniswapStakingRewardsProps {
  stakingAddress: string
  tokenAddress: string
}

export type UniswapStakingResponse = {
  decimals: number | null
  symbol: string | null
  userRewards: number
  userStake: number
  ethInPool: number
  aelinInPool: number
  totalAelinStaked?: number
  APY: number
}

export const useUniswapStakingRewards = ({
  stakingAddress,
  tokenAddress,
}: UseUniswapStakingRewardsProps): UniswapStakingResponse => {
  const { address, appChainId } = useWeb3Connection()

  // TODO: Make these calls in parallel
  const [totalStakedBalance] = useERC20Call(appChainId, tokenAddress, 'balanceOf', [stakingAddress])

  const [decimals] = useERC20Call(appChainId, tokenAddress, 'decimals', [])

  const [symbol] = useERC20Call(appChainId, tokenAddress, 'symbol', [])

  const [uniV2TotalSupply] = useERC20Call(appChainId, tokenAddress, 'totalSupply', [])

  const [rewardForDuration] = useStakingRewardsCall(
    appChainId,
    stakingAddress,
    'getRewardForDuration',
    [],
  )

  const [duration] = useStakingRewardsCall(appChainId, stakingAddress, 'rewardsDuration', [])

  const [userStake] = useStakingRewardsCall(appChainId, stakingAddress, 'balanceOf', [
    address || ZERO_ADDRESS,
  ])

  const [userRewards] = useStakingRewardsCall(appChainId, stakingAddress, 'earned', [
    address || ZERO_ADDRESS,
  ])

  const { data } = useCoingeckoRates()

  const { data: uniswapData } = useUniswapPoolAmount()

  const { reserve0, reserve1 } = uniswapData as UseUniswapPoolAmountResponse

  const { aelinRate, ethRate } = data as UseCoingeckoRatesResponse

  if (
    [
      decimals,
      symbol,
      userStake,
      userRewards,
      reserve0,
      reserve1,
      uniV2TotalSupply,
      totalStakedBalance,
      rewardForDuration,
      duration,
      ethRate,
      aelinRate,
    ].some((val) => val === null || typeof val === 'undefined')
  ) {
    console.error(new Error('Uniswap staking props cannot be empty.'))
  }

  const memoizedResult = useMemo(() => {
    const userRewardsInWei = new Wei(BigNumber.from(userRewards), 18)
    const userStakeInWei = new Wei(BigNumber.from(userStake), 18)
    const uniV2TotalSupplyInWei = new Wei(BigNumber.from(uniV2TotalSupply), 18)
    const totalStakedBalanceInWei = new Wei(BigNumber.from(totalStakedBalance), 18)
    const rewardForDurationInWei = new Wei(BigNumber.from(rewardForDuration), 18)

    const totalValueInPool = Number(reserve0) * aelinRate + Number(reserve1) * ethRate

    const uniV2Price = totalValueInPool / uniV2TotalSupplyInWei.toNumber()
    const yearProRata = ONE_YEAR_IN_SECS / (duration ?? ZERO_BN).toNumber()

    const uniV2ValueInContract = totalStakedBalanceInWei.toNumber() * uniV2Price
    const rewardsValuePerYear = rewardForDurationInWei.toNumber() * yearProRata * aelinRate

    return {
      decimals,
      symbol,
      userRewards: userRewardsInWei.toNumber(),
      userStake: userStakeInWei.toNumber(),
      ethInPool: Number(reserve1),
      aelinInPool: Number(reserve0),
      APY: (100 * rewardsValuePerYear) / uniV2ValueInContract,
    }
  }, [
    aelinRate,
    decimals,
    duration,
    ethRate,
    reserve0,
    reserve1,
    rewardForDuration,
    symbol,
    totalStakedBalance,
    uniV2TotalSupply,
    userRewards,
    userStake,
  ])

  return memoizedResult
}
