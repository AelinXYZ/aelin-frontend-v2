import { useMemo } from 'react'
import styled from 'styled-components'

import StakeSection from '@/src/components/stake/StakeSection'
import { contracts as contractsConfig } from '@/src/constants/contracts'
import { useAelinStakingRewards } from '@/src/hooks/aelin/useAelinStakingRewards'
import { useGelatoStakingRewards } from '@/src/hooks/aelin/useGelatoStakingRewards'
import { useUniswapStakingRewards } from '@/src/hooks/aelin/useUniswapStakingRewards'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: center;
`

const StakeGrid = () => {
  const { appChainId } = useWeb3Connection()

  const StakeBoxes = useMemo(
    () => ({
      10: [
        {
          isPool2: false,
          useStakingRewards: useAelinStakingRewards,
          contractAddresses: {
            stakingAddress: contractsConfig.STAKING_REWARDS.address[appChainId],
            tokenAddress: contractsConfig.AELIN_TOKEN.address[appChainId],
          },
          textTooltip:
            'Staking AELIN gives a share of 29 AELIN/month in inflationary rewards + 2/3 of protocol deal fees. Note deal fees are temporarily custodied by the Aelin Council and will be distributed in the future.',
          textTooltipAPY:
            'Estimation based on the total amount of rewards for a year and the total value staked in the contract.',
          title: 'Aelin staking',
        },
        {
          isPool2: true,
          useStakingRewards: useGelatoStakingRewards,
          contractAddresses: {
            stakingAddress: contractsConfig.LP_STAKING_REWARDS.address[appChainId],
            tokenAddress: contractsConfig.LP_TOKEN.address[appChainId],
          },
          textTooltip:
            'Staking AELIN/ETH LP gives a share of 44 AELIN/month in inflationary rewards + 1/3 of deal fees. Note deal fees are temporarily custodied by the Aelin Council and will be distributed in the future.',
          textTooltipAPY:
            'Estimation based on the total amount of rewards for a year and the total value staked in the contract. Trading fees from Uniswap not included.',
          title: 'AELIN/ETH staking',
        },
      ],
      1: [
        {
          isPool2: true,
          useStakingRewards: useUniswapStakingRewards,
          contractAddresses: {
            stakingAddress: contractsConfig.LP_STAKING_REWARDS.address[appChainId],
            tokenAddress: contractsConfig.LP_TOKEN.address[appChainId],
          },
          textTooltip:
            'Staking AELIN/ETH LP gives a share of 50 AELIN/month in inflationary rewards.',
          textTooltipAPY:
            'Estimation based on the total amount of rewards for a year and the total value staked in the contract. Trading fees from Uniswap not included.',
          title: 'AELIN/ETH staking',
        },
      ],
      5: [],
      42: [],
    }),
    [appChainId],
  )

  return (
    <Wrapper>
      {StakeBoxes[appChainId].map(
        (
          { contractAddresses, isPool2, textTooltip, textTooltipAPY, title, useStakingRewards },
          i,
        ) => (
          <StakeSection
            contractAddresses={contractAddresses}
            isPool2={isPool2}
            key={`stake-boxes-${i}`}
            textTooltip={textTooltip}
            textTooltipAPY={textTooltipAPY}
            title={title}
            useStakingRewards={useStakingRewards}
          />
        ),
      )}
    </Wrapper>
  )
}

export default StakeGrid
