import type { NextPage } from 'next'
import Head from 'next/head'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'

const Stake: NextPage = () => {
  return (
    <>
      <Head>Stake</Head>
      <LeftSidebarLayout>Stake workflow and more!</LeftSidebarLayout>
    </>
  )
}

export default Stake
