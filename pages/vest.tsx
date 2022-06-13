import type { NextPage } from 'next'
import Head from 'next/head'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { VestDealTokens } from '@/src/components/vest/VestDealTokens'
import { VestSectionIntro } from '@/src/components/vest/VestSectionIntro'
import { RequiredConnection } from '@/src/hooks/requiredConnection'

const Vest: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aelin - Vest</title>
      </Head>
      <LeftSidebarLayout>
        <VestSectionIntro />
        <RequiredConnection
          isNotConnectedText="You must be logged to see your vesting data"
          minHeight={120}
        >
          <VestDealTokens />
        </RequiredConnection>
      </LeftSidebarLayout>
    </>
  )
}

export default Vest
