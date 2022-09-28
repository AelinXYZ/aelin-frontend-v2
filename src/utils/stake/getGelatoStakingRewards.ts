import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import Wei from '@synthetixio/wei'

import AelinStakingABI from '@/src/abis/AelinStaking.json'
import ERC20ABI from '@/src/abis/ERC20.json'
import GelatoPoolABI from '@/src/abis/GelatoPool.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { contracts } from '@/src/constants/contracts'
import { BASE_DECIMALS, ZERO_BN } from '@/src/constants/misc'
import { ONE_YEAR_IN_SECS } from '@/src/constants/time'
import contractCall from '@/src/utils/contractCall'
import { getAelinETHRates } from '@/src/utils/stake/stakeUtils'

type GelatoStakingArgs = {
  address: string
  chainId: ChainsValues
}

export type GelatoStakingResponse = {
  decimals: number
  symbol: string
  userRewards: BigNumber
  userStake: BigNumber
  tokenBalance: BigNumber
  ethInPool: BigNumber
  aelinInPool: BigNumber
  APY: number
}

export const getGelatoStakingRewards = async ({ address, chainId }: GelatoStakingArgs) => {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)

  const tokenAddress = contracts.LP_TOKEN.address[10]
  const stakingAddress = contracts.LP_STAKING_REWARDS.address[10]
  const gelatoStakingAddress = contracts.GELATO_POOL.address[10]

  try {
    const promises = [
      contractCall(tokenAddress, ERC20ABI, provider, 'balanceOf', [stakingAddress]),
      contractCall(tokenAddress, ERC20ABI, provider, 'balanceOf', [address]),
      contractCall(tokenAddress, ERC20ABI, provider, 'decimals', []),
      contractCall(tokenAddress, ERC20ABI, provider, 'symbol', []),
      contractCall(gelatoStakingAddress, GelatoPoolABI, provider, 'getUnderlyingBalances', []),
      contractCall(gelatoStakingAddress, GelatoPoolABI, provider, 'totalSupply', []),
      contractCall(stakingAddress, AelinStakingABI, provider, 'getRewardForDuration', []),
      contractCall(stakingAddress, AelinStakingABI, provider, 'rewardsDuration', []),
      contractCall(stakingAddress, AelinStakingABI, provider, 'balanceOf', [address]),
      contractCall(stakingAddress, AelinStakingABI, provider, 'earned', [address]),
      getAelinETHRates(),
    ]

    const [
      totalStakedBalance,
      tokenBalance,
      decimals,
      symbol,
      balances,
      gUNITotalSupply,
      rewardForDuration,
      duration,
      userStake,
      userRewards,
      rates,
    ] = await Promise.all(promises)

    const aelinRate = rates.aelin.usd
    const ethRate = rates.ethereum.usd

    const amount0CurrentInWei = new Wei(BigNumber.from(balances?.amount0Current), BASE_DECIMALS)
    const amount1CurrentInWei = new Wei(BigNumber.from(balances?.amount1Current), BASE_DECIMALS)
    const gUNITotalSupplyInWei = new Wei(BigNumber.from(gUNITotalSupply), BASE_DECIMALS)
    const totalStakedBalanceInWei = new Wei(BigNumber.from(totalStakedBalance), BASE_DECIMALS)
    const rewardForDurationInWei = new Wei(BigNumber.from(rewardForDuration), BASE_DECIMALS)

    const totalValueInPool =
      amount0CurrentInWei.toNumber() * ethRate + amount1CurrentInWei.toNumber() * aelinRate
    const gUNIPrice = totalValueInPool / gUNITotalSupplyInWei.toNumber()
    const yearProRata = ONE_YEAR_IN_SECS / (duration ?? ZERO_BN).toNumber()
    const gUNIValueInContract = totalStakedBalanceInWei.toNumber() * gUNIPrice
    const rewardsValuePerYear = rewardForDurationInWei.toNumber() * yearProRata * aelinRate

    return {
      decimals: decimals || BASE_DECIMALS,
      symbol: symbol || '',
      userRewards: userRewards || ZERO_BN,
      userStake: userStake || ZERO_BN,
      tokenBalance: tokenBalance || ZERO_BN,
      ethInPool: balances?.amount0Current || ZERO_BN,
      aelinInPool: balances?.amount1Current || ZERO_BN,
      APY: (100 * rewardsValuePerYear) / gUNIValueInContract,
    }
  } catch (error) {
    console.error('error: ', error)
    throw error
  }
}
