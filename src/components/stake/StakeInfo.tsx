import { FC } from 'react'
import styled from 'styled-components'

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

import { STAKING_DECIMALS, ZERO_BN } from '@/src/constants/misc'
import { AelinStakingResponse } from '@/src/hooks/aelin/useAelinStakingRewards'
import { GelatoStakingResponse } from '@/src/hooks/aelin/useGelatoStakingRewards'
import { UniswapStakingResponse } from '@/src/hooks/aelin/useUniswapStakingRewards'
import { formatToken } from '@/src/web3/bigNumber'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 20px 0 10px;
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
`

const Value = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`

type StakingRewardsResponse = AelinStakingResponse | GelatoStakingResponse | UniswapStakingResponse

type StakeInfoProps = {
  isPool2: boolean
  rewards: StakingRewardsResponse & {
    ethInPool?: BigNumberish
    aelinInPool?: BigNumberish
    totalStakedBalance?: BigNumberish
  }
}

const StakeInfo: FC<StakeInfoProps> = ({ isPool2, rewards, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      {isPool2 && (
        <>
          <Text>
            ETH in pool via G-UNI:{' '}
            <Value>{`${
              BigNumber.isBigNumber(rewards.ethInPool)
                ? formatToken(rewards.ethInPool, rewards.decimals)
                : Number(rewards.ethInPool).toFixed(2)
            }`}</Value>
          </Text>
          <Text>
            Aelin in pool via G-UNI:{' '}
            <Value>{`${
              BigNumber.isBigNumber(rewards.aelinInPool)
                ? formatToken(rewards.aelinInPool, rewards.decimals)
                : Number(rewards.aelinInPool).toFixed(2)
            }`}</Value>
          </Text>
          <Text>
            My stake:{' '}
            <Value>{`${formatToken(rewards.userStake, rewards.decimals, STAKING_DECIMALS)} ${
              rewards.symbol
            }`}</Value>
          </Text>
        </>
      )}
      {!isPool2 && (
        <>
          <Text>
            Aelin staking:{' '}
            <Value>{`${formatToken(rewards.totalStakedBalance || ZERO_BN, rewards.decimals)} ${
              rewards?.symbol
            }`}</Value>
          </Text>
          <Text>
            My stake:{' '}
            <Value>{`${formatToken(rewards.userStake, rewards.decimals, STAKING_DECIMALS)} ${
              rewards?.symbol
            }`}</Value>
          </Text>
        </>
      )}
    </Wrapper>
  )
}

export default StakeInfo
