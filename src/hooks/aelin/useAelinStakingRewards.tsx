import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import Wei from '@synthetixio/wei'

import { ZERO_ADDRESS } from '@/src/constants/misc'
import { ZERO_BN } from '@/src/constants/misc'
import { ONE_YEAR_IN_SECS } from '@/src/constants/time'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import useStakingRewardsCall from '@/src/hooks/contracts/useStakingRewardsCall'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

interface UseAelinStakingRewardsProps {
  stakingAddress: string
  tokenAddress: string
}

export type AelinStakingResponse = {
  decimals: number | null
  symbol: string | null
  userRewards: number
  userStake: number
  ethInPool?: number
  aelinInPool?: number
  totalAelinStaked: number
  APY: number
}

export const useAelinStakingRewards = ({
  stakingAddress,
  tokenAddress,
}: UseAelinStakingRewardsProps): AelinStakingResponse => {
  const { address, appChainId } = useWeb3Connection()

  const [totalStakedBalance] = useERC20Call(appChainId, tokenAddress, 'balanceOf', [stakingAddress])

  const [decimals] = useERC20Call(appChainId, tokenAddress, 'decimals', [])

  const [symbol] = useERC20Call(appChainId, tokenAddress, 'symbol', [])

  // TODO: Make these calls in parallel
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

  if (
    [
      decimals,
      symbol,
      totalStakedBalance,
      rewardForDuration,
      duration,
      userStake,
      userRewards,
    ].some((val) => val === null || typeof val === 'undefined')
  ) {
    console.error(new Error('Staking props cannot be empty.'))
  }

  const memoizedResult = useMemo(() => {
    const yearProRata = ONE_YEAR_IN_SECS / (duration ?? ZERO_BN).toNumber()
    const userRewardsInWei = new Wei(BigNumber.from(userRewards), 18)
    const userStakeInWei = new Wei(BigNumber.from(userStake), 18)
    const totalStakedBalanceInWei = new Wei(BigNumber.from(totalStakedBalance), 18)
    const rewardForDurationInWei = new Wei(BigNumber.from(rewardForDuration), 18)

    return {
      decimals,
      symbol,
      userRewards: userRewardsInWei.toNumber(),
      userStake: userStakeInWei.toNumber(),
      totalAelinStaked: totalStakedBalanceInWei.toNumber(),
      APY:
        (100 * (rewardForDurationInWei.toNumber() * yearProRata)) /
        totalStakedBalanceInWei.toNumber(),
    }
  }, [decimals, duration, rewardForDuration, symbol, totalStakedBalance, userRewards, userStake])

  return memoizedResult
}
