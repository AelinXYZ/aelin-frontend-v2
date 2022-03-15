import type { NextPage } from 'next'

import { InnerContainer } from '@/src/components/pureStyledComponents/layout/InnerContainer'
import useSdk from '@/src/hooks/useSdk'
import { useGeneral } from '@/src/providers/generalProvider'

const Home: NextPage = () => {
  const sdk = useSdk()
  console.log(sdk)
  // Return poolsCreated on chain id 42 (Kovan)
  // const { data, error } = queriesSDK['42'].usePoolsCreated()
  //
  // if (error) return <div>failed to load</div>
  // if (!data) return <div>loading...</div>

  return (
    <>
      <InnerContainer as="main">
        <h2>Welcome to Bootnode-web3-Next.js!</h2>
        <p>
          Get started by editing <code>pages/index.js</code>
        </p>
      </InnerContainer>
    </>
  )
}

export default Home
