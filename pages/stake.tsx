import type { NextPage } from 'next'
import Head from 'next/head'

import { SectionIntro } from '@/src/components/common/SectionIntro'
import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { StakeSection } from '@/src/components/stake/StakeSection'
import { useAelinStakingRewards } from '@/src/hooks/aelin/useAelinStakingRewards'
import { useGelatoStakingRewards } from '@/src/hooks/aelin/useGelatoStakingRewards'
import { useUniswapStakingRewards } from '@/src/hooks/aelin/useUniswapStakingRewards'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const AELIN_STAKING_REWARDS_PER_CHAIN = {
  1: useUniswapStakingRewards,
  10: useGelatoStakingRewards,
}

const Stake: NextPage = () => {
  const { appChainId } = useWeb3Connection()

  const isOP = appChainId === 10
  const isMainnnet = appChainId === 1

  return (
    <>
      <Head>Stake</Head>
      <LeftSidebarLayout>
        <SectionIntro
          backgroundImage="resources/svg/bg-stake.svg"
          button={{
            title: 'Go to Sorbet.Finance',
            onClick: () =>
              window.open(
                'https://www.sorbet.finance/#/pools/0x665d8D87ac09Bdbc1222B8B9E72Ddcb82f76B54A',
                '_blank',
              ),
          }}
          description={`
            <p>
              Aelin Tokenholders can stake their AELIN or AELIN/ETH liquidity tokens to receive
              inflationary reward, deal fees, and governance voting power. Read more about the
              benefits of staking Aelin <a target="_blank" href="https://mirror.xyz/aelingov.eth/vWMW887qout1flAyGJZ0mPJdpfrdaPSQeRt9X6cQqkQ">here</a>.
            <p/>
            <p>
              To obtain G-UNI AELIN/ETH LP tokens, first
              provide liquidity into the AELIN/ETH pool on Uniswap via Sorbet.Finance. A full
              tutorial can be found on our blog here.
            </p>
          `}
          title="Stake"
        />
        {isOP && <StakeSection isPool2={false} useAelinStakingRewards={useAelinStakingRewards} />}
        {(isOP || isMainnnet) && (
          <StakeSection
            isPool2={true}
            useAelinStakingRewards={AELIN_STAKING_REWARDS_PER_CHAIN[appChainId]}
          />
        )}
      </LeftSidebarLayout>
    </>
  )
}

export default Stake
