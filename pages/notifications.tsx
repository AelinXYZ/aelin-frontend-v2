import type { NextPage } from 'next'
import Head from 'next/head'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'

const Notifications: NextPage = () => {
  return (
    <>
      <Head>Notifications</Head>
      <LeftSidebarLayout>
        You'll be notificated about everything you need to be notified about here.
      </LeftSidebarLayout>
    </>
  )
}

export default Notifications
