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
import {
  AelinRatesResponse,
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
    const totalStakedBalance = await contractCall(tokenAddress, ERC20ABI, provider, 'balanceOf', [
      stakingAddress,
    ])

    const tokenBalance = await contractCall(tokenAddress, ERC20ABI, provider, 'balanceOf', [
      address,
    ])

    const decimals = await contractCall(tokenAddress, ERC20ABI, provider, 'decimals', [])

    const symbol = await contractCall(tokenAddress, ERC20ABI, provider, 'symbol', [])

    const uniV2TotalSupply = await contractCall(
      stakingAddress,
      AelinStakingABI,
      provider,
      'totalSupply',
      [],
    )

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

    const rates: AelinRatesResponse = await getAelinETHRates()
    const aelinRate = rates.aelin.usd
    const ethRate = rates.ethereum.usd

    const uniswapData: UniswapResponse = await getUniswapPoolAmount()
    const aelinInPool = uniswapData.pair.reserve0
    const ethInPool = uniswapData.pair.reserve1

    const uniV2TotalSupplyInWei = new Wei(BigNumber.from(uniV2TotalSupply), 18)
    const totalStakedBalanceInWei = new Wei(BigNumber.from(totalStakedBalance), 18)
    const rewardForDurationInWei = new Wei(BigNumber.from(rewardForDuration), 18)

    const totalValueInPool = Number(aelinInPool) * aelinRate + Number(ethInPool) * ethRate

    const uniV2Price = totalValueInPool / uniV2TotalSupplyInWei.toNumber()
    const yearProRata = ONE_YEAR_IN_SECS / (duration ?? ZERO_BN).toNumber()

    const uniV2ValueInContract = totalStakedBalanceInWei.toNumber() * uniV2Price
    const rewardsValuePerYear = rewardForDurationInWei.toNumber() * yearProRata * aelinRate

    return {
      decimals: decimals || 18,
      symbol: symbol || '',
      userRewards: userRewards || ZERO_BN,
      userStake: userStake || ZERO_BN,
      tokenBalance: tokenBalance || ZERO_BN,
      ethInPool,
      aelinInPool,
      APY: (100 * rewardsValuePerYear) / uniV2ValueInContract,
    }
  } catch (error) {
    console.error('error: ', error)
    throw error
  }
}
