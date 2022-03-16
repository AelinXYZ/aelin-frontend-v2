import type { NextPage } from 'next'
import Head from 'next/head'

import { InnerContainer } from '@/src/components/pureStyledComponents/layout/InnerContainer'

const CreatePool: NextPage = () => {
  return (
    <>
      <Head>Create Pool</Head>
      <InnerContainer as="main">Create pool.</InnerContainer>
    </>
  )
}

export default CreatePool
