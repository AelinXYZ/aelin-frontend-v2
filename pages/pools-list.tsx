import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'

const PoolsList: NextPage = () => {
  return (
    <>
      <Head>Pools List</Head>
      <LeftSidebarLayout>
        There's gonna be a lot of stuff here!
        <div>
          Oh, and you can <Link href="create-pool">create a pool here!</Link>
        </div>
      </LeftSidebarLayout>
    </>
  )
}

export default PoolsList
