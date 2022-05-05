import { BigNumber } from '@ethersproject/bignumber'
import Wei from '@synthetixio/wei'

import { ZERO_ADDRESS } from '@/src/constants/misc'
import { ZERO_BN } from '@/src/constants/misc'
import { ONE_YEAR_IN_SECS } from '@/src/constants/time'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import useStakingRewardsCall from '@/src/hooks/contracts/useStakingRewardsCall'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export type AelinStakingResponse = {
  decimals: number
  symbol: string
  userRewards: BigNumber
  userStake: BigNumber
  totalStakedBalance: BigNumber
  APY: number
}

export const useAelinStakingRewards = (
  stakingAddress: string,
  tokenAddress: string,
): AelinStakingResponse => {
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

  const yearProRata = ONE_YEAR_IN_SECS / (duration ?? ZERO_BN).toNumber()
  const totalStakedBalanceInWei = new Wei(BigNumber.from(totalStakedBalance), 18)
  const rewardForDurationInWei = new Wei(BigNumber.from(rewardForDuration), 18)

  return {
    decimals: decimals || 18,
    symbol: symbol || '',
    userRewards: userRewards || ZERO_BN,
    userStake: userStake || ZERO_BN,
    totalStakedBalance: totalStakedBalance || ZERO_BN,
    APY:
      (100 * (rewardForDurationInWei.toNumber() * yearProRata)) /
      totalStakedBalanceInWei.toNumber(),
  }
}
