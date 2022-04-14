import { FC, useMemo } from 'react'

import { contracts as contractsConfig } from '@/src/constants/contracts'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type ContractsType = { staking: string; token: string }

interface StakeSectionProps {
  isPool2: boolean
  useAelinStakingRewards: ({
    stakingRewardsContract,
    tokenContract,
  }: {
    stakingRewardsContract: string
    tokenContract: string
  }) => { eth?: number; aelin?: number; totalAelinStake?: number; APY: number } | null
}

export const StakeSection: FC<StakeSectionProps> = ({
  isPool2 = false,
  useAelinStakingRewards,
}) => {
  const { address, appChainId } = useWeb3Connection()

  const memoizedContracts: ContractsType = useMemo(() => {
    if (isPool2) {
      return {
        staking: contractsConfig.LP_STAKING_REWARDS.address[appChainId],
        token: contractsConfig.LP_TOKEN.address[appChainId],
      }
    }

    return {
      staking: contractsConfig.STAKING_REWARDS.address[appChainId],
      token: contractsConfig.AELIN_TOKEN.address[appChainId],
    }
  }, [appChainId, isPool2])

  const [allowance] = useERC20Call(appChainId, memoizedContracts.token, 'allowance', [
    address || ZERO_ADDRESS,
    memoizedContracts.staking,
  ])

  const rewards = useAelinStakingRewards({
    stakingRewardsContract: memoizedContracts.staking,
    tokenContract: memoizedContracts.token,
  })

  console.log('allowance: ', allowance)
  console.log('rewards: ', rewards)

  return (
    <div>
      <></>
    </div>
  )
}
