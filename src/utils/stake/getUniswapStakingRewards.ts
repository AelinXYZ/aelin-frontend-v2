import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import Wei from '@synthetixio/wei'

import AelinStakingABI from '@/src/abis/AelinStaking.json'
import ERC20ABI from '@/src/abis/ERC20.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { contracts } from '@/src/constants/contracts'
import { BASE_DECIMALS, ZERO_BN } from '@/src/constants/misc'
import { ONE_YEAR_IN_SECS } from '@/src/constants/time'
import contractCall from '@/src/utils/contractCall'
import {
  UniswapResponse,
  getAelinETHRates,
  getUniswapPoolAmount,
} from '@/src/utils/stake/stakeUtils'

type UniswapStakingArgs = {
  address: string
  chainId: ChainsValues
}

export type UniswapStakingResponse = {
  decimals: number
  symbol: string
  userRewards: BigNumber
  userStake: BigNumber
  tokenBalance: BigNumber
  ethInPool: string
  aelinInPool: string
  APY: number
}

export const getUniswapStakingRewards = async ({
  address,
  chainId,
}: UniswapStakingArgs): Promise<UniswapStakingResponse> => {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)

  const tokenAddress = contracts.LP_TOKEN.address[1]
  const stakingAddress = contracts.LP_STAKING_REWARDS.address[1]

  try {
    const promises = [
      contractCall(tokenAddress, ERC20ABI, provider, 'balanceOf', [stakingAddress]),
      contractCall(tokenAddress, ERC20ABI, provider, 'balanceOf', [address]),
      contractCall(tokenAddress, ERC20ABI, provider, 'decimals', []),
      contractCall(tokenAddress, ERC20ABI, provider, 'symbol', []),
      contractCall(stakingAddress, AelinStakingABI, provider, 'totalSupply', []),
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
      uniV2TotalSupply,
      rewardForDuration,
      duration,
      userStake,
      userRewards,
      rates,
    ] = await Promise.all(promises)

    const aelinRate = rates.aelin.usd
    const ethRate = rates.ethereum.usd

    /*
    const uniswapData: UniswapResponse = await getUniswapPoolAmount()
    const aelinInPool = uniswapData.pair.reserve0
    const ethInPool = uniswapData.pair.reserve1
    

    const uniV2TotalSupplyInWei = new Wei(BigNumber.from(uniV2TotalSupply), BASE_DECIMALS)
    const totalStakedBalanceInWei = new Wei(BigNumber.from(totalStakedBalance), BASE_DECIMALS)
    const rewardForDurationInWei = new Wei(BigNumber.from(rewardForDuration), BASE_DECIMALS)

    const totalValueInPool = Number(aelinInPool) * aelinRate + Number(ethInPool) * ethRate

    const uniV2Price = totalValueInPool / uniV2TotalSupplyInWei.toNumber()
    const yearProRata = ONE_YEAR_IN_SECS / (duration ?? ZERO_BN).toNumber()

    const uniV2ValueInContract = totalStakedBalanceInWei.toNumber() * uniV2Price
    const rewardsValuePerYear = rewardForDurationInWei.toNumber() * yearProRata * aelinRate
    */

    return {
      decimals: decimals || BASE_DECIMALS,
      symbol: symbol || '',
      userRewards: userRewards || ZERO_BN,
      userStake: userStake || ZERO_BN,
      tokenBalance: tokenBalance || ZERO_BN,
      // Temp fix til uniswap v2 subgraph work
      ethInPool: '0',
      aelinInPool: '0',
      APY: 0, // (100 * rewardsValuePerYear) / uniV2ValueInContract,
    }
  } catch (error) {
    console.error('error: ', error)
    throw error
  }
}
