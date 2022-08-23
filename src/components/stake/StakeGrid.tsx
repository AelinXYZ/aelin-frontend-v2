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
            stakingAddress: contracts.STAKING_REWARDS.address[Chains.optimism],
            tokenAddress: contracts.AELIN_TOKEN.address[Chains.optimism],
          }}
          explorerUrl={getExplorerUrl(
            contracts.STAKING_REWARDS.address[Chains.optimism],
            appChainId,
          )}
          key={StakingEnum.AELIN}
          note={
            'Note: There are no active rewards for pool 1 stakers although in the future there will be a pro rata claim of deal fees for stakers based on time in the pool'
          }
          stakeType={StakingEnum.AELIN}
          title={'Aelin staking'}
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
          key={StakingEnum.GELATO}
          stakeType={StakingEnum.GELATO}
          title={'Deprecated AELIN/ETH staking'}
        />,
      ],
      [Chains.mainnet]: [
        <StakeSection
          contractAddresses={{
            stakingAddress: contracts.LP_STAKING_REWARDS.address[Chains.mainnet],
            tokenAddress: contracts.LP_TOKEN.address[Chains.mainnet],
          }}
          explorerUrl={getExplorerUrl(
            contracts.LP_STAKING_REWARDS.address[Chains.mainnet],
            appChainId,
          )}
          key={StakingEnum.UNISWAP}
          stakeType={StakingEnum.UNISWAP}
          title={'AELIN/ETH staking'}
        />,
      ],
      [Chains.goerli]: [],
      [Chains.kovan]: [],
    }),
    [appChainId],
  )

  const stakeBoxes = useMemo(() => stakePerChain[appChainId], [appChainId, stakePerChain])

  return <Wrapper {...restProps}>{stakeBoxes.map((box: ReactNode) => box)}</Wrapper>
}

export default StakeGrid
