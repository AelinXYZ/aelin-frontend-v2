import type { NextPage } from 'next'
import Head from 'next/head'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'

const Claim: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aelin - Claim</title>
      </Head>
      <LeftSidebarLayout>No claim no gain.</LeftSidebarLayout>
    </>
  )
}

export default Claim
