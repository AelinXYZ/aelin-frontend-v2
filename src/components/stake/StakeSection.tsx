import { FC } from 'react'
import styled from 'styled-components'

import { DEPOSIT_TYPE, WITHDRAW_TYPE } from '../../constants/types'
import { Etherscan } from '@/src/components/assets/Etherscan'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { BaseTitle } from '@/src/components/pureStyledComponents/text/BaseTitle'
import ClaimBox from '@/src/components/stake/ClaimBox'
import StakeInfo from '@/src/components/stake/StakeInfo'
import StakeTabContent from '@/src/components/stake/StakeTabContent'
import Tabs, { Tab } from '@/src/components/tabs/Tabs'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { AelinStakingResponse } from '@/src/hooks/aelin/useAelinStakingRewards'
import { GelatoStakingResponse } from '@/src/hooks/aelin/useGelatoStakingRewards'
import { UniswapStakingResponse } from '@/src/hooks/aelin/useUniswapStakingRewards'

const Wrapper = styled(BaseCard)`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const Icon = styled(Etherscan)`
  margin: 0 auto 10px;
`

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
  useStakingRewards: (stakingAddress: string, tokenAddress: string) => StakingRewardsResponse
}

const StakeSection: FC<StakeSectionProps> = ({
  contractAddresses,
  isPool2 = false,
  textTooltip,
  textTooltipAPY,
  title,
  useStakingRewards,
  ...restProps
}) => {
  const { stakingAddress, tokenAddress } = contractAddresses

  const rewards: StakingRewardsResponse = useStakingRewards(stakingAddress, tokenAddress)

  /*
  const rewards: StakingRewardsResponse = {
    decimals: 18,
    symbol: 'AELIN',
    userRewards: BigNumber.from('0x11a5b9518e'),
    userStake: BigNumber.from('0x78db1d92bd2a'),
    totalStakedBalance: BigNumber.from('0x33d8bc21a447964d84'),
    APY: 36.89176475474039,
  }
  */

  return (
    <Wrapper {...restProps}>
      <Icon />
      <TitleWrapper>
        <BaseTitle>{title}</BaseTitle>
        <Tooltip text={textTooltip} />
      </TitleWrapper>
      <APYWrapper>
        <APYValue>APY: {`${Math.round(rewards?.APY ?? 0)}% `}</APYValue>
        <Tooltip text={textTooltipAPY} />
      </APYWrapper>
      <Tabs>
        <Tab label="Deposit">
          <StakeTabContent
            decimals={rewards.decimals}
            stakingAddress={stakingAddress}
            symbol={rewards.symbol}
            tokenAddress={tokenAddress}
            type={DEPOSIT_TYPE}
          />
        </Tab>
        <Tab label="Withdraw">
          <StakeTabContent
            decimals={rewards.decimals}
            stakingAddress={stakingAddress}
            symbol={rewards.symbol}
            tokenAddress={tokenAddress}
            type={WITHDRAW_TYPE}
          />
        </Tab>
      </Tabs>
      <StakeInfo isPool2={isPool2} rewards={rewards} />
      <ClaimBox
        decimals={rewards.decimals}
        stakingAddress={stakingAddress}
        userRewards={rewards.userRewards}
      />
    </Wrapper>
  )
}

export default genericSuspense(StakeSection)
