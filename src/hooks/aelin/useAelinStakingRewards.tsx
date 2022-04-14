import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import Wei from '@synthetixio/wei'

import { ONE_YEAR_IN_SECS } from '@/src/constants/time'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import useStakingRewardsCall from '@/src/hooks/contracts/useStakingRewardsCall'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

interface UseAelinStakingRewardsProps {
  stakingRewardsContract: string
  tokenContract: string
}

export const useAelinStakingRewards = ({
  stakingRewardsContract,
  tokenContract,
}: UseAelinStakingRewardsProps) => {
  const { address, appChainId } = useWeb3Connection()

  const [totalStakedBalance] = useERC20Call(appChainId, tokenContract, 'balanceOf', [
    stakingRewardsContract,
  ])

  // TODO: Make these calls in parallel
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

  if (
    [totalStakedBalance, rewardForDuration, duration, userStake, userRewards].some(
      (val) => val === null || val === undefined,
    )
  ) {
    console.error(new Error('Staking props cannot be empty.'))
    return null
  }

  const yearProRata = ONE_YEAR_IN_SECS / Number(duration)

  const userRewardsInWei = new Wei(BigNumber.from(userRewards), 18)
  const userStakeInWei = new Wei(BigNumber.from(userStake), 18)
  const totalStakedBalanceInWei = new Wei(BigNumber.from(totalStakedBalance), 18)
  const rewardForDurationInWei = new Wei(BigNumber.from(rewardForDuration), 18)

  return {
    userRewards: userRewardsInWei.toNumber(),
    userStake: userStakeInWei.toNumber(),
    totalAelinStaked: totalStakedBalanceInWei.toNumber(),
    APY:
      (100 * (rewardForDurationInWei.toNumber() * yearProRata)) /
      totalStakedBalanceInWei.toNumber(),
  }
}
