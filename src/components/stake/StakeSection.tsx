import { FC } from 'react'
import styled from 'styled-components'

import { Etherscan } from '@/src/components/assets/Etherscan'
import { Loading } from '@/src/components/common/Loading'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { BaseTitle } from '@/src/components/pureStyledComponents/text/BaseTitle'
import ClaimBox from '@/src/components/stake/ClaimBox'
import StakeInfo from '@/src/components/stake/StakeInfo'
import StakeTabContent from '@/src/components/stake/StakeTabContent'
import Tabs, { Tab } from '@/src/components/tabs/Tabs'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { DEPOSIT_TYPE, WITHDRAW_TYPE } from '@/src/constants/types'
import { StakingEnum, useStakingRewards } from '@/src/providers/stakingRewardsProvider'

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

interface StakeSectionProps {
  contractAddresses: {
    stakingAddress: string
    tokenAddress: string
  }
  explorerUrl: string
  stakeType: StakingEnum
  textTooltipAPY: string
  title: string
}

const StakeSection: FC<StakeSectionProps> = ({
  contractAddresses,
  explorerUrl,
  stakeType,
  textTooltipAPY,
  title,
  ...restProps
}) => {
  const { stakingAddress, tokenAddress } = contractAddresses

  const { data, error, isLoading } = useStakingRewards()

  const rewards = data[stakeType]

  if (error) {
    throw error
  }

  if (isLoading) return <Loading />

  if (!rewards) return null

  return (
    <Wrapper {...restProps}>
      <a href={explorerUrl} rel="noreferrer" target="_blank">
        <Icon />
      </a>
      <TitleWrapper>
        <BaseTitle>{title}</BaseTitle>
      </TitleWrapper>
      <APYWrapper>
        {stakeType !== StakingEnum.UNISWAP && (
          <>
            <APYValue>APY: {`${Math.round(rewards?.APY ?? 0)}% `}</APYValue>
            <Tooltip text={textTooltipAPY} />
          </>
        )}
      </APYWrapper>

      <Tabs>
        <Tab label="Deposit">
          <StakeTabContent
            rewards={rewards}
            stakeType={stakeType}
            stakingAddress={stakingAddress}
            tabType={DEPOSIT_TYPE}
            tokenAddress={tokenAddress}
          />
        </Tab>
        <Tab label="Withdraw">
          <StakeTabContent
            rewards={rewards}
            stakeType={stakeType}
            stakingAddress={stakingAddress}
            tabType={WITHDRAW_TYPE}
            tokenAddress={tokenAddress}
          />
        </Tab>
      </Tabs>
      <StakeInfo rewards={rewards} stakeType={stakeType} />
      <ClaimBox
        decimals={rewards.decimals}
        stakeType={stakeType}
        stakingAddress={stakingAddress}
        userRewards={rewards.userRewards}
      />
    </Wrapper>
  )
}

export default genericSuspense(StakeSection)
