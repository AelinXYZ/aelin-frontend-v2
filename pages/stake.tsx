import type { NextPage } from 'next'
import Head from 'next/head'

import StakeBanner from '@/src/components/stake/StakeBanner'
import StakeGrid from '@/src/components/stake/StakeGrid'

const Stake: NextPage = () => {
  return (
    <>
      <Head>
        <title>Stake</title>
      </Head>
      <StakeBanner />
      <StakeGrid />
    </>
  )
}

export default Stake
