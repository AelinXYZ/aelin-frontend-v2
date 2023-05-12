import router from 'next/router'
import { FC, useEffect, useState } from 'react'
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
  margin: 0;
  margin-bottom: 10px;
`

const Note = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 0.9rem;
  line-height: 1.2;
  margin: 10px;
  min-width: 320px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
`

interface StakeSectionProps {
  contractAddresses: {
    stakingAddress: string
    tokenAddress: string
  }
  explorerUrl: string
  note?: string
  stakeType: StakingEnum
  title: string
  isDeprecated?: boolean
}

const StakeSection: FC<StakeSectionProps> = ({
  contractAddresses,
  explorerUrl,
  isDeprecated = false,
  note,
  stakeType,
  title,
  ...restProps
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const { stakingAddress, tokenAddress } = contractAddresses

  const { data, error, isLoading } = useStakingRewards()

  const rewards = data[stakeType]

  useEffect(() => {
    setIsVisible(
      isDeprecated
        ? router.pathname.includes('deprecated')
        : !router.pathname.includes('deprecated'),
    )
  }, [isDeprecated])

  if (error) {
    throw error
  }

  if (isLoading) return <Loading />

  if (!rewards) return null

  if (!isVisible) return null

  return (
    <Wrapper {...restProps}>
      {note && <Note>{note}</Note>}
      <a href={explorerUrl} rel="noreferrer" target="_blank">
        <Icon />
      </a>
      <TitleWrapper>
        <BaseTitle>{title}</BaseTitle>
      </TitleWrapper>

      <Tabs>
        {!isDeprecated && (
          <Tab label="Deposit">
            <StakeTabContent
              rewards={rewards}
              stakeType={stakeType}
              stakingAddress={stakingAddress}
              tabType={DEPOSIT_TYPE}
              tokenAddress={tokenAddress}
            />
          </Tab>
        )}
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
