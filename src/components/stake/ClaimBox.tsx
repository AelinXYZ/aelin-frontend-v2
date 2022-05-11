import { FC } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { STAKING_DECIMALS, ZERO_BN } from '@/src/constants/misc'
import useStakingRewardsTransaction from '@/src/hooks/contracts/useStakingRewardsTransaction'
import { StakingEnum, useStakingRewards } from '@/src/providers/stakingRewardsProvider'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { formatToken } from '@/src/web3/bigNumber'

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
  stakeType: StakingEnum
  userRewards: BigNumber
  decimals: number
}

const ClaimBox: FC<ClaimBoxProps> = ({ decimals, stakeType, stakingAddress, userRewards }) => {
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { handleAfterClaim } = useStakingRewards()

  const { estimate: estimateGetReward, execute } = useStakingRewardsTransaction(
    stakingAddress,
    'getReward',
  )

  const handleClaim = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await execute([], txGasOptions)
        if (receipt) {
          handleAfterClaim(stakeType)
        }
      },
      title: 'Claim AELIN tokens',
      estimate: () => estimateGetReward(),
    })
  }

  return (
    <Wrapper>
      <Title>Claim rewards</Title>
      <Text>
        My Rewards: <Value>{formatToken(userRewards, decimals, STAKING_DECIMALS)} AELIN</Value>
      </Text>
      <Button disabled={userRewards.eq(ZERO_BN) || isSubmitting} onClick={handleClaim}>
        Claim
      </Button>
    </Wrapper>
  )
}

export default ClaimBox
