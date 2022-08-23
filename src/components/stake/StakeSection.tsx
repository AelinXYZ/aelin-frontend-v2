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
  font-size: 1.4rem;
  line-height: 1.2;
  margin: 10px;
  min-width: 320px;
  padding: 20px;
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
}

const StakeSection: FC<StakeSectionProps> = ({
  contractAddresses,
  explorerUrl,
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
    if (stakeType === StakingEnum.GELATO) {
      if (router.pathname.includes('deprecated')) {
        setIsVisible(true)
      }
    }

    if (stakeType === StakingEnum.AELIN) {
      setIsVisible(true)
    }
  }, [stakeType])

  if (error) {
    throw error
  }

  if (isLoading) return <Loading />

  if (!rewards) return null

  if (!isVisible) return null

  return (
    <Wrapper {...restProps}>
      <a href={explorerUrl} rel="noreferrer" target="_blank">
        <Icon />
      </a>
      <TitleWrapper>
        <BaseTitle>{title}</BaseTitle>
      </TitleWrapper>

      <Tabs>
        {stakeType === StakingEnum.AELIN && (
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
      {note && <Note>{note}</Note>}
    </Wrapper>
  )
}

export default genericSuspense(StakeSection)
