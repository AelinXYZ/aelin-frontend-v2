import { FC, useState } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseTitle } from '@/src/components/pureStyledComponents/text/BaseTitle'
import { ZERO_BN } from '@/src/constants/misc'
import useStakingRewardsTransaction from '@/src/hooks/contracts/useStakingRewardsTransaction'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-width: 320px;
  background-color: rgba(255, 255, 255, 0.04);
  border: ${({ theme: { card } }) => card.borderColor};
  border-radius: ${({ theme: { card } }) => card.borderRadius};
`

const SubTitle = styled(BaseTitle)`
  font-size: 2rem;
  margin: 0;
  margin-top: 15px;
`

const Value = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`

const Text = styled.p`
  color: #babcc1;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
`

const StyledGradientButton = styled(GradientButton)`
  width: 160px;
`

type ClaimBoxProps = {
  stakingAddress: string
  userRewards: number
}

const ClaimBox: FC<ClaimBoxProps> = ({ stakingAddress, userRewards }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [rewardsToClaim, setRewardsToClaim] = useState(userRewards)

  const getReward = useStakingRewardsTransaction(stakingAddress, 'getReward')

  const handleClaim = async () => {
    try {
      await getReward()
      setRewardsToClaim(0)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <Wrapper>
      <SubTitle>Claim rewards</SubTitle>
      <Text>
        My Rewards: <Value>{rewardsToClaim} AELIN</Value>
      </Text>
      <StyledGradientButton
        disabled={BigNumber.from(rewardsToClaim).eq(ZERO_BN) || isLoading}
        onClick={handleClaim}
      >
        Claim
      </StyledGradientButton>
    </Wrapper>
  )
}

export default ClaimBox
