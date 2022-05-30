import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import Wei from '@synthetixio/wei'

import AelinStakingABI from '@/src/abis/AelinStaking.json'
import ERC20ABI from '@/src/abis/ERC20.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/config/chains'
import { contracts } from '@/src/constants/config/contracts'
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
}

export const getAelinStakingRewards = async ({ address, chainId }: AelinStakingArgs) => {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)

  const tokenAddress = contracts.AELIN_TOKEN.address[10]
  const stakingAddress = contracts.STAKING_REWARDS.address[10]

  try {
    const promises = [
      contractCall(tokenAddress, ERC20ABI, provider, 'balanceOf', [stakingAddress]),
      contractCall(tokenAddress, ERC20ABI, provider, 'balanceOf', [address]),
      contractCall(tokenAddress, ERC20ABI, provider, 'decimals', []),
      contractCall(tokenAddress, ERC20ABI, provider, 'symbol', []),
      contractCall(stakingAddress, AelinStakingABI, provider, 'getRewardForDuration', []),
      contractCall(stakingAddress, AelinStakingABI, provider, 'rewardsDuration', []),
      contractCall(stakingAddress, AelinStakingABI, provider, 'balanceOf', [address]),
      contractCall(stakingAddress, AelinStakingABI, provider, 'earned', [address]),
    ]

    const [
      totalStakedBalance,
      tokenBalance,
      decimals,
      symbol,
      rewardForDuration,
      duration,
      userStake,
      userRewards,
    ] = await Promise.all(promises)

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
