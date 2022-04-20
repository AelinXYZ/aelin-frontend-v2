import { FC } from 'react'
import styled from 'styled-components'

import { DEPOSIT_TYPE, WITHDRAW_TYPE } from '../../constants/types'
import ClaimBox from './ClaimBox'
import StakeInfo from './StakeInfo'
import StakeTabContent from './StakeTabContent'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { BaseTitle } from '@/src/components/pureStyledComponents/text/BaseTitle'
import Tabs, { Tab } from '@/src/components/tabs/Tabs'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { AelinStakingResponse } from '@/src/hooks/aelin/useAelinStakingRewards'
import { GelatoStakingResponse } from '@/src/hooks/aelin/useGelatoStakingRewards'
import { UniswapStakingResponse } from '@/src/hooks/aelin/useUniswapStakingRewards'

const TitleWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 0 0 5px;
`

const APYWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 0 0 10px;
`

const APYValue = styled.span`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 1.6rem;
  font-weight: 600;
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
      <TitleWrapper>
        <BaseTitle>{title}</BaseTitle>
        <Tooltip text={textTooltip} />
      </TitleWrapper>
      <APYWrapper>
        <APYValue>APY: {`${Math.round(rewards?.APY ?? 0)}% `}</APYValue>
        <Tooltip text={textTooltipAPY} />
      </APYWrapper>
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
