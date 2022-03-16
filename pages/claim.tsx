import type { NextPage } from 'next'
import Head from 'next/head'

import { InnerContainer } from '@/src/components/pureStyledComponents/layout/InnerContainer'

const Claim: NextPage = () => {
  return (
    <>
      <Head>Claim</Head>
      <InnerContainer as="main">No claim no gain.</InnerContainer>
    </>
  )
}

export default Claim
