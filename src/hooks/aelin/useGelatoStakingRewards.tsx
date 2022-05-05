import { BigNumber } from '@ethersproject/bignumber'
import Wei from '@synthetixio/wei'

import { contracts } from '@/src/constants/contracts'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ONE_YEAR_IN_SECS } from '@/src/constants/time'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import useGelatoStakingCall from '@/src/hooks/contracts/useGelatoStakingCall'
import useStakingRewardsCall from '@/src/hooks/contracts/useStakingRewardsCall'
import { UseCoingeckoRatesResponse, useCoingeckoRates } from '@/src/hooks/useCoingeckoRates'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export type GelatoStakingResponse = {
  decimals: number
  symbol: string
  userRewards: BigNumber
  userStake: BigNumber
  ethInPool: BigNumber
  aelinInPool: BigNumber
  APY: number
}

export const useGelatoStakingRewards = (
  stakingAddress: string,
  tokenAddress: string,
): GelatoStakingResponse => {
  const { address, appChainId } = useWeb3Connection()

  // TODO: Make these calls in parallel
  const [totalStakedBalance] = useERC20Call(appChainId, tokenAddress, 'balanceOf', [stakingAddress])

  const [decimals] = useERC20Call(appChainId, tokenAddress, 'decimals', [])

  const [symbol] = useERC20Call(appChainId, tokenAddress, 'symbol', [])

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

  const { aelinRate, ethRate } = data as UseCoingeckoRatesResponse

  const amount0CurrentInWei = new Wei(BigNumber.from(balances?.amount0Current), 18)
  const amount1CurrentInWei = new Wei(BigNumber.from(balances?.amount1Current), 18)
  const gUNITotalSupplyInWei = new Wei(BigNumber.from(gUNITotalSupply), 18)
  const totalStakedBalanceInWei = new Wei(BigNumber.from(totalStakedBalance), 18)
  const rewardForDurationInWei = new Wei(BigNumber.from(rewardForDuration), 18)

  const totalValueInPool =
    amount0CurrentInWei.toNumber() * ethRate + amount1CurrentInWei.toNumber() * aelinRate
  const gUNIPrice = totalValueInPool / gUNITotalSupplyInWei.toNumber()
  const yearProRata = ONE_YEAR_IN_SECS / (duration ?? ZERO_BN).toNumber()
  const gUNIValueInContract = totalStakedBalanceInWei.toNumber() * gUNIPrice
  const rewardsValuePerYear = rewardForDurationInWei.toNumber() * yearProRata * aelinRate

  return {
    decimals: decimals || 18,
    symbol: symbol || '',
    userRewards: userRewards || ZERO_BN,
    userStake: userStake || ZERO_BN,
    ethInPool: balances?.amount0Current || ZERO_BN,
    aelinInPool: balances?.amount1Current || ZERO_BN,
    APY: (100 * rewardsValuePerYear) / gUNIValueInContract,
  }
}
