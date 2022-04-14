import type { NextPage } from 'next'
import Head from 'next/head'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'

const Sponsors: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aelin - Sponsors</title>
      </Head>
      <LeftSidebarLayout>Sponsors</LeftSidebarLayout>
    </>
  )
}

export default Sponsors
