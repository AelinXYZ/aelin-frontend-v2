import { useMemo } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import { ButtonGradient } from '../pureStyledComponents/buttons/Button'
import { Loading } from '@/src/components/common/Loading'
import { contracts } from '@/src/constants/contracts'
import { STAKING_DECIMALS, ZERO_BN } from '@/src/constants/misc'
import useStakingRewardsTransaction from '@/src/hooks/contracts/useStakingRewardsTransaction'
import { StakingEnum, useStakingRewards } from '@/src/providers/stakingRewardsProvider'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { formatToken } from '@/src/web3/bigNumber'

const Wrapper = styled.div`
  margin-bottom: 40px;
`

const Rows = styled.div`
  margin-bottom: 20px;
`

const Row = styled.div`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 0.9rem;
  margin: 0 0 8px 0;

  &:last-child {
    margin-bottom: 0;
  }
`

const Value = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

const AelinData: React.FC = ({ ...restProps }) => {
  const { appChainId } = useWeb3Connection()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { data, error, handleAfterClaim, isLoading } = useStakingRewards()

  const stakingAddress = useMemo(() => {
    return contracts.KWENTA_STAKING_REWARDS.address[appChainId]
  }, [appChainId])

  const { estimate: estimateGetReward, execute } = useStakingRewardsTransaction(
    stakingAddress,
    'getReward',
  )

  const rewards = data[StakingEnum.KWENTA]

  if (isLoading)
    return (
      <Wrapper>
        <Loading />
      </Wrapper>
    )

  if (error) {
    throw error
  }

  const values = [
    {
      title: 'Aelin balance:',
      value: `${formatToken(
        rewards?.tokenBalance as BigNumber,
        rewards?.decimals,
        STAKING_DECIMALS,
      )} ${rewards?.symbol}`,
    },
    {
      title: 'My stake:',
      value: `${formatToken(
        rewards?.userStake as BigNumber,
        rewards?.decimals,
        STAKING_DECIMALS,
      )} ${rewards?.symbol}`,
    },
    {
      title: 'My rewards:',
      value: `${formatToken(
        rewards?.userRewards as BigNumber,
        rewards?.decimals,
        STAKING_DECIMALS,
      )} KWENTA`,
    },
  ]

  const handleClaim = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await execute([], txGasOptions)
        if (receipt) {
          handleAfterClaim(StakingEnum.KWENTA)
        }
      },
      title: `Claim KWENTA tokens`,
      estimate: () => estimateGetReward(),
    })
  }

  return (
    <Wrapper {...restProps}>
      <Rows>
        {values.map(({ title, value }, index) => (
          <Row key={index}>
            {title} <Value>{value}</Value>
          </Row>
        ))}
      </Rows>
      <ButtonContainer>
        <ButtonGradient
          disabled={rewards?.userRewards.eq(ZERO_BN) || isSubmitting}
          onClick={handleClaim}
        >
          Claim
        </ButtonGradient>
      </ButtonContainer>
    </Wrapper>
  )
}

export default AelinData
