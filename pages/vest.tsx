import type { NextPage } from 'next'
import Head from 'next/head'

import { VestDealTokens } from '@/src/components/vest/VestDealTokens'
import { VestSectionIntro } from '@/src/components/vest/VestSectionIntro'

const Vest: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aelin - Vest</title>
      </Head>
      <VestSectionIntro />
      <VestDealTokens />
    </>
  )
}

export default Vest
