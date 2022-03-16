import type { NextPage } from 'next'
import Head from 'next/head'

import { InnerContainer } from '@/src/components/pureStyledComponents/layout/InnerContainer'

const Notifications: NextPage = () => {
  return (
    <>
      <Head>Notifications</Head>
      <InnerContainer as="main">
        You'll be notificated about everything you need to be notified about here.
      </InnerContainer>
    </>
  )
}

export default Notifications
