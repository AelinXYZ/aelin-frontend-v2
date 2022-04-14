import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import Wei from '@synthetixio/wei'

import { contracts } from '@/src/constants/contracts'
import { ONE_YEAR_IN_SECS } from '@/src/constants/time'
import { useCoingeckoRates } from '@/src/hooks/aelin/useCoingeckoRates'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import useGelatoStakingCall from '@/src/hooks/contracts/useGelatoStakingCall'
import useStakingRewardsCall from '@/src/hooks/contracts/useStakingRewardsCall'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

interface UseGelatoStakingRewardsProps {
  stakingRewardsContract: string
  tokenContract: string
}

export const useGelatoStakingRewards = ({
  stakingRewardsContract,
  tokenContract,
}: UseGelatoStakingRewardsProps) => {
  const { address, appChainId } = useWeb3Connection()

  // TODO: Make these calls in parallel
  const [totalStakedBalance] = useERC20Call(appChainId, tokenContract, 'balanceOf', [
    stakingRewardsContract,
  ])

  const [balances] = useGelatoStakingCall(
    appChainId,
    contracts.GELATO_POOL.address[appChainId],
    'getUnderlyingBalances',
    [],
  )

  const [gUNITotalSupply] = useGelatoStakingCall(
    appChainId,
    contracts.GELATO_POOL.address[appChainId],
    'totalSupply',
    [],
  )

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

  const { data = null } = useCoingeckoRates()

  if (
    [
      userStake,
      userRewards,
      balances?.amount0Current,
      balances?.amount1Current,
      gUNITotalSupply,
      totalStakedBalance,
      rewardForDuration,
      duration,
      data,
    ].some((val) => val === null || val === undefined)
  ) {
    console.error(new Error('Gelato staking props cannot be empty.'))
    return null
  }

  // TODO: remove this if
  if (!data) return null

  const userRewardsInWei = new Wei(BigNumber.from(userRewards), 18)
  const userStakeInWei = new Wei(BigNumber.from(userStake), 18)
  const amount0CurrentInWei = new Wei(BigNumber.from(balances?.amount0Current), 18)
  const amount1CurrentInWei = new Wei(BigNumber.from(balances?.amount1Current), 18)
  const gUNITotalSupplyInWei = new Wei(BigNumber.from(gUNITotalSupply), 18)
  const totalStakedBalanceInWei = new Wei(BigNumber.from(totalStakedBalance), 18)
  const rewardForDurationInWei = new Wei(BigNumber.from(rewardForDuration), 18)

  const totalValueInPool =
    amount0CurrentInWei.toNumber() * data?.ethRate + amount1CurrentInWei.toNumber() * data.aelinRate
  const gUNIPrice = totalValueInPool / gUNITotalSupplyInWei.toNumber()
  const yearProRata = ONE_YEAR_IN_SECS / Number(duration)
  const gUNIValueInContract = totalStakedBalanceInWei.toNumber() * gUNIPrice
  const rewardsValuePerYear = rewardForDurationInWei.toNumber() * yearProRata * data.aelinRate

  return {
    userRewards: userRewardsInWei.toNumber(),
    userStake: userStakeInWei.toNumber(),
    eth: amount0CurrentInWei.toNumber(),
    aelin: amount1CurrentInWei.toNumber(),
    APY: (100 * rewardsValuePerYear) / gUNIValueInContract,
  }
}
