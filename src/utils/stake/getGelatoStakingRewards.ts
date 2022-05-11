import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import Wei from '@synthetixio/wei'

import AelinStakingABI from '@/src/abis/AelinStaking.json'
import ERC20ABI from '@/src/abis/ERC20.json'
import GelatoPoolABI from '@/src/abis/GelatoPool.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { contracts } from '@/src/constants/contracts'
import { ZERO_BN } from '@/src/constants/misc'
import { ONE_YEAR_IN_SECS } from '@/src/constants/time'
import contractCall from '@/src/utils/contractCall'
import { AelinRatesResponse, getAelinETHRates } from '@/src/utils/stake/stakeUtils'

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
    const totalStakedBalance = await contractCall(tokenAddress, ERC20ABI, provider, 'balanceOf', [
      stakingAddress,
    ])

    const tokenBalance = await contractCall(tokenAddress, ERC20ABI, provider, 'balanceOf', [
      address,
    ])

    const decimals = await contractCall(tokenAddress, ERC20ABI, provider, 'decimals', [])

    const symbol = await contractCall(tokenAddress, ERC20ABI, provider, 'symbol', [])

    const balances = await contractCall(
      gelatoStakingAddress,
      GelatoPoolABI,
      provider,
      'getUnderlyingBalances',
      [],
    )

    const gUNITotalSupply = await contractCall(
      gelatoStakingAddress,
      GelatoPoolABI,
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

    const userStake = await contractCall(stakingAddress, GelatoPoolABI, provider, 'balanceOf', [
      address,
    ])

    const userRewards = await contractCall(stakingAddress, GelatoPoolABI, provider, 'earned', [
      address,
    ])

    const rates: AelinRatesResponse = await getAelinETHRates()
    const aelinRate = rates.aelin.usd
    const ethRate = rates.ethereum.usd

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
