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
import { WITHDRAW_TYPE } from '@/src/constants/types'
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
  margin: 0;
  margin-bottom: 10px;
`

interface StakeSectionProps {
  contractAddresses: {
    stakingAddress: string
    tokenAddress: string
  }
  explorerUrl: string
  stakeType: StakingEnum
  title: string
}

const StakeSection: FC<StakeSectionProps> = ({
  contractAddresses,
  explorerUrl,
  stakeType,
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

      <Tabs>
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
