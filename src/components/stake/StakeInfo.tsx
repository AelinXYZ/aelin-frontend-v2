import { FC } from 'react'
import styled from 'styled-components'

import { AelinStakingResponse } from '@/src/hooks/aelin/useAelinStakingRewards'
import { GelatoStakingResponse } from '@/src/hooks/aelin/useGelatoStakingRewards'
import { UniswapStakingResponse } from '@/src/hooks/aelin/useUniswapStakingRewards'

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

type StakingRewardsResponse = GelatoStakingResponse | AelinStakingResponse | UniswapStakingResponse

type StakeInfoProps = {
  isPool2: boolean
  rewards: StakingRewardsResponse
}

const StakeInfo: FC<StakeInfoProps> = ({ isPool2, rewards, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      {isPool2 && (
        <>
          <Text>
            ETH in pool via G-UNI: <Value>{`${rewards?.ethInPool?.toFixed(2) ?? 0}`}</Value>
          </Text>
          <Text>
            Aelin in pool via G-UNI: <Value>{`${rewards?.aelinInPool?.toFixed(2) ?? 0}`}</Value>
          </Text>
          <Text>
            My stake: <Value>{`${rewards?.userStake ?? 0} ${rewards?.symbol}`}</Value>
          </Text>
        </>
      )}
      {!isPool2 && (
        <>
          <Text>
            Aelin staking:{' '}
            <Value>{`${rewards?.totalAelinStaked?.toFixed(2) ?? 0} ${rewards?.symbol}`}</Value>
          </Text>
          <Text>
            My stake: <Value>{`${rewards?.userStake ?? 0} ${rewards?.symbol}`}</Value>
          </Text>
        </>
      )}
    </Wrapper>
  )
}

export default StakeInfo
