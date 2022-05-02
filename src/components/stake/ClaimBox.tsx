import { FC, useState } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { ZERO_BN } from '@/src/constants/misc'
import { useStakingRewardsTransactionWithModal } from '@/src/hooks/contracts/useStakingRewardsTransaction'

const Wrapper = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.transparentWhite2};
  border-radius: ${({ theme: { card } }) => card.borderRadius};
  border: 1px solid ${({ theme: { card } }) => card.borderColor};
  display: flex;
  flex-direction: column;
  min-width: 320px;
  padding: 20px;
`

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 20px;
  text-align: center;
  width: 100%;
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 0 15px;
  text-align: center;
  width: 100%;
`

const Value = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`

const Button = styled(GradientButton)`
  min-width: 160px;
`

type ClaimBoxProps = {
  stakingAddress: string
  userRewards: number
}

const ClaimBox: FC<ClaimBoxProps> = ({ stakingAddress, userRewards }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [rewardsToClaim, setRewardsToClaim] = useState(userRewards)

  const {
    estimate: estimateGetReward,
    getModalTransaction,
    setShowModalTransaction,
  } = useStakingRewardsTransactionWithModal(stakingAddress, 'getReward')

  const handleClaim = async () => {
    setShowModalTransaction(true)
    setIsLoading(true)
    try {
      await estimateGetReward()
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <Wrapper>
      <Title>Claim rewards</Title>
      <Text>
        My Rewards: <Value>{rewardsToClaim} AELIN</Value>
      </Text>
      <Button
        disabled={BigNumber.from(rewardsToClaim).eq(ZERO_BN) || isLoading}
        onClick={handleClaim}
      >
        Claim
      </Button>
      {getModalTransaction(
        'Claim tokens',
        () => {
          setRewardsToClaim(0)
          setIsLoading(false)
        },
        () => {
          setIsLoading(false)
        },
      )}
    </Wrapper>
  )
}

export default ClaimBox
