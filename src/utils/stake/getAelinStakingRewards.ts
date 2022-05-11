import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import Wei from '@synthetixio/wei'

import AelinStakingABI from '@/src/abis/AelinStaking.json'
import ERC20ABI from '@/src/abis/ERC20.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { contracts } from '@/src/constants/contracts'
import { ZERO_BN } from '@/src/constants/misc'
import { ONE_YEAR_IN_SECS } from '@/src/constants/time'
import contractCall from '@/src/utils/contractCall'

type AelinStakingArgs = {
  address: string
  chainId: ChainsValues
}

export type AelinStakingResponse = {
  decimals: number
  symbol: string
  userRewards: BigNumber
  userStake: BigNumber
  tokenBalance: BigNumber
  totalStakedBalance: BigNumber
  APY: number
} | null

export const getAelinStakingRewards = async ({ address, chainId }: AelinStakingArgs) => {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)

  const tokenAddress = contracts.AELIN_TOKEN.address[10]
  const stakingAddress = contracts.STAKING_REWARDS.address[10]

  try {
    const totalStakedBalance = await contractCall(tokenAddress, ERC20ABI, provider, 'balanceOf', [
      stakingAddress,
    ])

    const tokenBalance = await contractCall(tokenAddress, ERC20ABI, provider, 'balanceOf', [
      address,
    ])

    const decimals = await contractCall(tokenAddress, ERC20ABI, provider, 'decimals', [])

    const symbol = await contractCall(tokenAddress, ERC20ABI, provider, 'symbol', [])

    // TODO: Make these calls in parallel
    const rewardForDuration = await contractCall(
      stakingAddress,
      AelinStakingABI,
      provider,
      'getRewardForDuration',
      [],
    )

    const duration = await contractCall(
      stakingAddress,
      AelinStakingABI,
      provider,
      'rewardsDuration',
      [],
    )

    const userStake = await contractCall(stakingAddress, AelinStakingABI, provider, 'balanceOf', [
      address,
    ])

    const userRewards = await contractCall(stakingAddress, AelinStakingABI, provider, 'earned', [
      address,
    ])

    const yearProRata = ONE_YEAR_IN_SECS / (duration ?? ZERO_BN).toNumber()
    const totalStakedBalanceInWei = new Wei(BigNumber.from(totalStakedBalance), 18)
    const rewardForDurationInWei = new Wei(BigNumber.from(rewardForDuration), 18)

    return {
      decimals: decimals || 18,
      symbol: symbol || '',
      userRewards: userRewards || ZERO_BN,
      userStake: userStake || ZERO_BN,
      tokenBalance: tokenBalance || ZERO_BN,
      totalStakedBalance: totalStakedBalance || ZERO_BN,
      APY:
        (100 * (rewardForDurationInWei.toNumber() * yearProRata)) /
        totalStakedBalanceInWei.toNumber(),
    }
  } catch (error) {
    console.error('error: ', error)
    throw error
  }
}
