import type { NextPage } from 'next'
import Head from 'next/head'

import { InnerContainer } from '@/src/components/pureStyledComponents/layout/InnerContainer'

const Stake: NextPage = () => {
  return (
    <>
      <Head>Stake</Head>
      <InnerContainer as="main">Stake workflow and more!</InnerContainer>
    </>
  )
}

export default Stake
