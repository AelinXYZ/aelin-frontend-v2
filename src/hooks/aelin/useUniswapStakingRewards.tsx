import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import Wei from '@synthetixio/wei'

import { ONE_YEAR_IN_SECS } from '@/src/constants/time'
import { useCoingeckoRates } from '@/src/hooks/aelin/useCoingeckoRates'
import { useUniswapPoolAmount } from '@/src/hooks/aelin/useUniswapPoolAmount'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import useStakingRewardsCall from '@/src/hooks/contracts/useStakingRewardsCall'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

interface UseUniswapStakingRewardsProps {
  stakingRewardsContract: string
  tokenContract: string
}

export const useUniswapStakingRewards = ({
  stakingRewardsContract,
  tokenContract,
}: UseUniswapStakingRewardsProps) => {
  const { address, appChainId } = useWeb3Connection()

  // TODO: Make these calls in parallel
  const [totalStakedBalance] = useERC20Call(appChainId, tokenContract, 'balanceOf', [
    stakingRewardsContract,
  ])

  const [uniV2TotalSupply] = useERC20Call(appChainId, tokenContract, 'totalSupply', [])

  const [rewardForDuration] = useStakingRewardsCall(
    appChainId,
    stakingRewardsContract,
    'getRewardForDuration',
    [],
  )

  const [duration] = useStakingRewardsCall(
    appChainId,
    stakingRewardsContract,
    'rewardsDuration',
    [],
  )

  const [userStake] = useStakingRewardsCall(appChainId, stakingRewardsContract, 'balanceOf', [
    address || AddressZero,
  ])

  const [userRewards] = useStakingRewardsCall(appChainId, stakingRewardsContract, 'earned', [
    address || AddressZero,
  ])

  const { data: rates = null } = useCoingeckoRates()

  const { data: reserve = null } = useUniswapPoolAmount()

  if (
    [
      userStake,
      userRewards,
      reserve,
      uniV2TotalSupply,
      totalStakedBalance,
      rewardForDuration,
      duration,
      rates,
    ].some((val) => val === null || val === undefined)
  ) {
    console.error(new Error('Uniswap staking props cannot be empty.'))
    return null
  }

  // TODO: remove this if
  if (!rates || !reserve) return null

  const userRewardsInWei = new Wei(BigNumber.from(userRewards), 18)
  const userStakeInWei = new Wei(BigNumber.from(userStake), 18)
  const uniV2TotalSupplyInWei = new Wei(BigNumber.from(uniV2TotalSupply), 18)
  const totalStakedBalanceInWei = new Wei(BigNumber.from(totalStakedBalance), 18)
  const rewardForDurationInWei = new Wei(BigNumber.from(rewardForDuration), 18)

  const totalValueInPool =
    Number(reserve.reserve0) * rates.aelinRate + Number(reserve.reserve1) * rates.ethRate

  const uniV2Price = totalValueInPool / uniV2TotalSupplyInWei.toNumber()
  const yearProRata = ONE_YEAR_IN_SECS / Number(duration)

  const uniV2ValueInContract = totalStakedBalanceInWei.toNumber() * uniV2Price
  const rewardsValuePerYear = rewardForDurationInWei.toNumber() * yearProRata * rates.aelinRate

  return {
    userRewards: userRewardsInWei.toNumber(),
    userStake: userStakeInWei.toNumber(),
    eth: Number(reserve.reserve0),
    aelin: Number(reserve.reserve1),
    APY: (100 * rewardsValuePerYear) / uniV2ValueInContract,
  }
}
