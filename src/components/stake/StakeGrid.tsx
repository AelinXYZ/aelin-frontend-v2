import { ReactNode, useMemo } from 'react'
import styled from 'styled-components'

import StakeSection from '@/src/components/stake/StakeSection'
import { Chains } from '@/src/constants/chains'
import { contracts } from '@/src/constants/contracts'
import { StakingEnum } from '@/src/providers/stakingRewardsProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getExplorerUrl } from '@/src/utils/getExplorerUrl'

const Wrapper = styled.div`
  display: grid;
  gap: 40px;
  flex-grow: 1;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    grid-template-columns: 1fr 1fr;
  }
`

const StakeGrid = ({ ...restProps }) => {
  const { appChainId } = useWeb3Connection()

  const stakePerChain = useMemo(
    () => ({
      [Chains.optimism]: [
        <StakeSection
          contractAddresses={{
            stakingAddress: contracts.KWENTA_STAKING_REWARDS.address[Chains.optimism],
            tokenAddress: contracts.AELIN_TOKEN.address[Chains.optimism],
          }}
          explorerUrl={getExplorerUrl(
            contracts.KWENTA_STAKING_REWARDS.address[Chains.optimism],
            appChainId,
          )}
          key={StakingEnum.KWENTA}
          stakeType={StakingEnum.KWENTA}
          title={'Aelin staking'}
        />,
        <StakeSection
          contractAddresses={{
            stakingAddress: contracts.STAKING_REWARDS.address[Chains.optimism],
            tokenAddress: contracts.AELIN_TOKEN.address[Chains.optimism],
          }}
          explorerUrl={getExplorerUrl(
            contracts.STAKING_REWARDS.address[Chains.optimism],
            appChainId,
          )}
          isDeprecated={true}
          key={StakingEnum.AELIN}
          stakeType={StakingEnum.AELIN}
          title={'Deprecated Aelin staking'}
        />,
        <StakeSection
          contractAddresses={{
            stakingAddress: contracts.LP_STAKING_REWARDS.address[Chains.optimism],
            tokenAddress: contracts.LP_TOKEN.address[Chains.optimism],
          }}
          explorerUrl={getExplorerUrl(
            contracts.LP_STAKING_REWARDS.address[Chains.optimism],
            appChainId,
          )}
          isDeprecated={true}
          key={StakingEnum.GELATO}
          stakeType={StakingEnum.GELATO}
          title={'Deprecated AELIN/ETH staking'}
        />,
      ],
      [Chains.mainnet]: [],
      [Chains.goerli]: [],
      [Chains.sepolia]: [
        <StakeSection
          contractAddresses={{
            stakingAddress: contracts.KWENTA_STAKING_REWARDS.address[Chains.sepolia],
            tokenAddress: contracts.AELIN_TOKEN.address[Chains.sepolia],
          }}
          explorerUrl={getExplorerUrl(
            contracts.KWENTA_STAKING_REWARDS.address[Chains.sepolia],
            appChainId,
          )}
          key={StakingEnum.KWENTA}
          stakeType={StakingEnum.KWENTA}
          title={'Aelin staking'}
        />,
      ],
      [Chains.arbitrum]: [],
      [Chains.polygon]: [],
    }),
    [appChainId],
  )

  const stakeBoxes = useMemo(() => stakePerChain[appChainId], [appChainId, stakePerChain])

  return <Wrapper {...restProps}>{stakeBoxes.map((box: ReactNode) => box)}</Wrapper>
}

export default StakeGrid
