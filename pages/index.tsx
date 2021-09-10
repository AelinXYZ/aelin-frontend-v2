import type { NextPage } from 'next'
import Head from 'next/head'

import { InnerContainer } from '@/components/pureStyledComponents/layout/InnerContainer'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Web3 Next App</title>
      </Head>
      <InnerContainer as="main">
        <h2>Welcome to Bootnode-web3-Next.js!</h2>
        <p>
          Get started by editing <code>pages/index.js</code>
        </p>
      </InnerContainer>
    </>
  )
}

export default function App() {
  return <Home />
}
