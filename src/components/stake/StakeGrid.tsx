import { ReactNode, useMemo } from 'react'
import styled from 'styled-components'

import StakeSection from '@/src/components/stake/StakeSection'
import { contracts as contractsConfig } from '@/src/constants/contracts'
import { StakingEnum } from '@/src/providers/stakingRewardsProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div`
  display: grid;
  gap: 40px;
  grid-template-columns: 1fr 1fr;
  flex-grow: 1;
`

const StakeGrid = ({ ...restProps }) => {
  const { appChainId } = useWeb3Connection()

  const stakePerChain = useMemo(
    () => ({
      10: [
        <StakeSection
          contractAddresses={{
            stakingAddress: contractsConfig.STAKING_REWARDS.address[10],
            tokenAddress: contractsConfig.AELIN_TOKEN.address[10],
          }}
          key={StakingEnum.AELIN}
          stakeType={StakingEnum.AELIN}
          textTooltip={
            'Staking AELIN gives a share of 29 AELIN/month in inflationary rewards + 2/3 of protocol deal fees. Note deal fees are temporarily custodied by the Aelin Council and will be distributed in the future.'
          }
          textTooltipAPY={
            'Estimation based on the total amount of rewards for a year and the total value staked in the contract.'
          }
          title={'Aelin staking'}
        />,

        <StakeSection
          contractAddresses={{
            stakingAddress: contractsConfig.LP_STAKING_REWARDS.address[10],
            tokenAddress: contractsConfig.LP_TOKEN.address[10],
          }}
          key={StakingEnum.GELATO}
          stakeType={StakingEnum.GELATO}
          textTooltip={
            'Staking AELIN/ETH LP gives a share of 44 AELIN/month in inflationary rewards + 1/3 of deal fees. Note deal fees are temporarily custodied by the Aelin Council and will be distributed in the future.'
          }
          textTooltipAPY={
            'Estimation based on the total amount of rewards for a year and the total value staked in the contract. Trading fees from Uniswap not included.'
          }
          title={'AELIN/ETH staking'}
        />,
      ],
      1: [
        <StakeSection
          contractAddresses={{
            stakingAddress: contractsConfig.LP_STAKING_REWARDS.address[1],
            tokenAddress: contractsConfig.LP_TOKEN.address[1],
          }}
          key={StakingEnum.UNISWAP}
          stakeType={StakingEnum.UNISWAP}
          textTooltip={
            'Staking AELIN/ETH LP gives a share of 50 AELIN/month in inflationary rewards.'
          }
          textTooltipAPY={
            'Estimation based on the total amount of rewards for a year and the total value staked in the contract. Trading fees from Uniswap not included.'
          }
          title={'AELIN/ETH staking'}
        />,
      ],
      5: [],
      42: [],
    }),
    [],
  )

  const stakeBoxes = useMemo(() => stakePerChain[appChainId], [appChainId, stakePerChain])

  return <Wrapper {...restProps}>{stakeBoxes.map((box: ReactNode) => box)}</Wrapper>
}

export default StakeGrid
