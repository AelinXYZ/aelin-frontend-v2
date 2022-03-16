import type { NextPage } from 'next'
import Head from 'next/head'

import { InnerContainer } from '@/src/components/pureStyledComponents/layout/InnerContainer'

const History: NextPage = () => {
  return (
    <>
      <Head>History</Head>
      <InnerContainer as="main">We have some history.</InnerContainer>
    </>
  )
}

export default History
