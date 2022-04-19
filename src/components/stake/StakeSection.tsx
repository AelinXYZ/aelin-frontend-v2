import { FC } from 'react'
import styled from 'styled-components'

import ClaimBox from './ClaimBox'
import StakeInfo from './StakeInfo'
import StakeTabContent from './StakeTabContent'
import { DEPOSIT_TYPE, WITHDRAW_TYPE } from './kind'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { BaseTitle } from '@/src/components/pureStyledComponents/text/BaseTitle'
import Tabs, { Tab } from '@/src/components/tabs/Tabs'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { AelinStakingResponse } from '@/src/hooks/aelin/useAelinStakingRewards'
import { GelatoStakingResponse } from '@/src/hooks/aelin/useGelatoStakingRewards'
import { UniswapStakingResponse } from '@/src/hooks/aelin/useUniswapStakingRewards'

const SubTitle = styled.p`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 1.6rem;
  font-weight: 600;
  text-align: center;
`

const Wrapper = styled(BaseCard)`
  display: flex;
  align-items: center;
  flex-direction: column;
`

type StakingRewardsResponse = GelatoStakingResponse | AelinStakingResponse | UniswapStakingResponse

interface StakeSectionProps {
  contractAddresses: {
    stakingAddress: string
    tokenAddress: string
  }
  isPool2: boolean
  textTooltip: string
  textTooltipAPY: string
  title: string
  useStakingRewards: ({
    stakingAddress,
    tokenAddress,
  }: {
    stakingAddress: string
    tokenAddress: string
  }) => StakingRewardsResponse
}

const StakeSection: FC<StakeSectionProps> = ({
  contractAddresses,
  isPool2 = false,
  textTooltip,
  textTooltipAPY,
  title,
  useStakingRewards,
}) => {
  const { stakingAddress, tokenAddress } = contractAddresses

  const rewards: StakingRewardsResponse = useStakingRewards({ stakingAddress, tokenAddress })

  return (
    <Wrapper>
      <BaseTitle>
        {`${title} `}
        <Tooltip text={textTooltip} />
      </BaseTitle>
      <SubTitle>
        APY: {`${Math.round(rewards?.APY ?? 0)}% `}
        <Tooltip text={textTooltipAPY} />
      </SubTitle>
      <Tabs defaultIndex={0}>
        <Tab label="Deposit">
          <StakeTabContent
            decimals={rewards?.decimals ?? 18}
            stakingAddress={stakingAddress}
            symbol={rewards?.symbol ?? ''}
            tokenAddress={tokenAddress}
            type={DEPOSIT_TYPE}
          />
        </Tab>
        <Tab label="Withdraw">
          <StakeTabContent
            decimals={rewards?.decimals ?? 18}
            stakingAddress={stakingAddress}
            symbol={rewards?.symbol ?? ''}
            tokenAddress={tokenAddress}
            type={WITHDRAW_TYPE}
          />
        </Tab>
      </Tabs>
      <StakeInfo isPool2={isPool2} rewards={rewards} />
      <ClaimBox stakingAddress={stakingAddress} userRewards={rewards?.userRewards ?? 0} />
    </Wrapper>
  )
}

export default genericSuspense(StakeSection)
