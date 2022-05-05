import { BigNumber } from '@ethersproject/bignumber'
import Wei from '@synthetixio/wei'

import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ONE_YEAR_IN_SECS } from '@/src/constants/time'
import {
  UseUniswapPoolAmountResponse,
  useUniswapPoolAmount,
} from '@/src/hooks/aelin/useUniswapPoolAmount'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import useStakingRewardsCall from '@/src/hooks/contracts/useStakingRewardsCall'
import { UseCoingeckoRatesResponse, useCoingeckoRates } from '@/src/hooks/useCoingeckoRates'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export type UniswapStakingResponse = {
  decimals: number
  symbol: string
  userRewards: BigNumber
  userStake: BigNumber
  ethInPool: string
  aelinInPool: string
  APY: number
}

export const useUniswapStakingRewards = (
  stakingAddress: string,
  tokenAddress: string,
): UniswapStakingResponse => {
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

  const { reserve0: aelinInPool, reserve1: ethInPool } = uniswapData as UseUniswapPoolAmountResponse

  const { aelinRate, ethRate } = data as UseCoingeckoRatesResponse

  const uniV2TotalSupplyInWei = new Wei(BigNumber.from(uniV2TotalSupply), 18)
  const totalStakedBalanceInWei = new Wei(BigNumber.from(totalStakedBalance), 18)
  const rewardForDurationInWei = new Wei(BigNumber.from(rewardForDuration), 18)

  const totalValueInPool = Number(aelinInPool) * aelinRate + Number(ethInPool) * ethRate

  const uniV2Price = totalValueInPool / uniV2TotalSupplyInWei.toNumber()
  const yearProRata = ONE_YEAR_IN_SECS / (duration ?? ZERO_BN).toNumber()

  const uniV2ValueInContract = totalStakedBalanceInWei.toNumber() * uniV2Price
  const rewardsValuePerYear = rewardForDurationInWei.toNumber() * yearProRata * aelinRate

  return {
    decimals: decimals || 18,
    symbol: symbol || '',
    userRewards: userRewards || ZERO_BN,
    userStake: userStake || ZERO_BN,
    ethInPool,
    aelinInPool,
    APY: (100 * rewardsValuePerYear) / uniV2ValueInContract,
  }
}
