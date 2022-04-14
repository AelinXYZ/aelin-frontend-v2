import type { NextPage } from 'next'
import Head from 'next/head'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'

const Vest: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aelin - Vest</title>
      </Head>
      <LeftSidebarLayout>Vest</LeftSidebarLayout>
    </>
  )
}

export default Vest
