import type { NextPage } from 'next'
import Head from 'next/head'

import { InnerContainer } from '@/src/components/pureStyledComponents/layout/InnerContainer'

const PoolsList: NextPage = () => {
  return (
    <>
      <Head>Pools List</Head>
      <InnerContainer as="main">There's gonna be a lot of stuff here!</InnerContainer>
    </>
  )
}

export default PoolsList
