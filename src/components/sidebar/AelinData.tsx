import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import { Loading } from '@/src/components/common/Loading'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { TabButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { Filters } from '@/src/components/pureStyledComponents/common/Filters'
import { Chains } from '@/src/constants/chains'
import { contracts } from '@/src/constants/contracts'
import { ZERO_BN } from '@/src/constants/misc'
import useStakingRewardsTransaction from '@/src/hooks/contracts/useStakingRewardsTransaction'
import { StakingEnum, useStakingRewards } from '@/src/providers/stakingRewardsProvider'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import isDev from '@/src/utils/isDev'
import { formatToken } from '@/src/web3/bigNumber'

const Wrapper = styled.div`
  margin-bottom: 40px;
`

const Rows = styled.div`
  margin-bottom: 20px;
`

const Row = styled.div`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
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

function getBalanceTitle(activeTab: StakingEnum): string {
  switch (activeTab) {
    case StakingEnum.AELIN:
      return 'Aelin balance:'
    case StakingEnum.GELATO:
    case StakingEnum.UNISWAP:
      return 'AELIN/ETH balance:'
  }
}

const AelinData: React.FC = ({ ...restProps }) => {
  const { appChainId } = useWeb3Connection()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { data, error, handleAfterClaim, isLoading } = useStakingRewards()

  const [activeTab, setActiveTab] = useState<StakingEnum>(StakingEnum.AELIN)

  const isMainnet = Chains.mainnet === appChainId

  useEffect(() => {
    const activeTab = isMainnet ? StakingEnum.UNISWAP : StakingEnum.AELIN

    setActiveTab(activeTab)
  }, [appChainId, isMainnet])

  const stakingAddress = useMemo(() => {
    if (activeTab === StakingEnum.AELIN) {
      return contracts.STAKING_REWARDS.address[Chains.optimism]
    }

    if (activeTab === StakingEnum.GELATO) {
      return contracts.LP_STAKING_REWARDS.address[Chains.optimism]
    }

    if (activeTab === StakingEnum.UNISWAP) {
      return contracts.LP_STAKING_REWARDS.address[Chains.mainnet]
    }

    throw new Error('Unexpected tab')
  }, [activeTab])

  const { estimate: estimateGetReward, execute } = useStakingRewardsTransaction(
    stakingAddress,
    'getReward',
  )

  const rewards = data[activeTab]

  if (isLoading)
    return (
      <Wrapper>
        <Loading />
      </Wrapper>
    )

  if (error && !isDev) {
    throw error
  }

  const values = [
    {
      title: getBalanceTitle(activeTab),
      value: !isDev
        ? `${formatToken(rewards?.tokenBalance as BigNumber, rewards?.decimals)} ${rewards?.symbol}`
        : '0 AELIN',
    },
    {
      title: 'My stake:',
      value: !isDev
        ? `${formatToken(rewards?.userStake as BigNumber, rewards?.decimals)} ${rewards?.symbol}`
        : '0 AELIN',
    },
    {
      title: 'My rewards:',
      value: !isDev
        ? `${formatToken(rewards?.userRewards as BigNumber, rewards?.decimals)} ${rewards?.symbol}`
        : '0 AELIN',
    },
  ]

  console.log('rewards?.userRewards', rewards?.userRewards)

  const handleClaim = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await execute([], txGasOptions)
        if (receipt) {
          handleAfterClaim(activeTab)
        }
      },
      title: 'Claim AELIN tokens',
      estimate: () => estimateGetReward(),
    })
  }

  return (
    <Wrapper {...restProps}>
      <Filters justifyContent="flex-start">
        {isMainnet && (
          <TabButton
            isActive={activeTab === StakingEnum.UNISWAP}
            onClick={() => {
              setActiveTab(StakingEnum.UNISWAP)
            }}
          >
            ETH/Aelin
          </TabButton>
        )}
        {!isMainnet && (
          <>
            <TabButton
              isActive={activeTab === StakingEnum.AELIN}
              onClick={() => {
                setActiveTab(StakingEnum.AELIN)
              }}
            >
              Aelin
            </TabButton>
            <TabButton
              isActive={activeTab === StakingEnum.GELATO}
              onClick={() => {
                setActiveTab(StakingEnum.GELATO)
              }}
            >
              ETH/Aelin
            </TabButton>
          </>
        )}
      </Filters>
      <Rows>
        {values.map(({ title, value }, index) => (
          <Row key={index}>
            {title} <Value>{value}</Value>
          </Row>
        ))}
      </Rows>
      <ButtonContainer>
        <GradientButton
          disabled={rewards?.userRewards.eq(ZERO_BN) || isSubmitting || isDev}
          onClick={handleClaim}
        >
          Claim
        </GradientButton>
      </ButtonContainer>
    </Wrapper>
  )
}

export default AelinData
