import type { NextPage } from 'next'
import Head from 'next/head'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import StakeBanner from '@/src/components/stake/StakeBanner'

const Stake: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aelin - Stake</title>
      </Head>
      <LeftSidebarLayout>
        <StakeBanner />
      </LeftSidebarLayout>
    </>
  )
}

export default Stake
