import type { NextPage } from 'next'
import Head from 'next/head'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'

const History: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aelin - History</title>
      </Head>
      <LeftSidebarLayout>We have some history.</LeftSidebarLayout>
    </>
  )
}

export default History
