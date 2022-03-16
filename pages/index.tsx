import type { NextPage } from 'next'

import { InnerContainer } from '@/src/components/pureStyledComponents/layout/InnerContainer'

const Home: NextPage = () => {
  return (
    <>
      <InnerContainer as="main">
        <h2>Probably a landing page here?</h2>
        <p>We don't know (yet).</p>
      </InnerContainer>
    </>
  )
}

export default Home
