import type { NextPage } from 'next'
import Head from 'next/head'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import StakeBanner from '@/src/components/stake/StakeBanner'
import StakeGrid from '@/src/components/stake/StakeGrid'
import { Chains } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Stake: NextPage = () => {
  const { appChainId } = useWeb3Connection()

  return (
    <>
      <Head>
        <title>Aelin - Stake</title>
      </Head>
      <LeftSidebarLayout>
        <StakeBanner />
        {appChainId === Chains.mainnet && <StakeGrid />}
      </LeftSidebarLayout>
    </>
  )
}

export default Stake
