import type { NextPage } from 'next'
import Head from 'next/head'

import { SectionIntro } from '@/src/components/common/SectionIntro'
import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { VestDealTokens } from '@/src/components/vest/VestDealTokens'

const Vest: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aelin - Vest</title>
      </Head>
      <LeftSidebarLayout>
        <SectionIntro backgroundImage="/resources/svg/bg-vest.svg" title="Vest">
          Many Aelin pools will utilize a vesting period for underlying deal tokens. View details
          about your investments and vest your deal tokens below.
        </SectionIntro>
        <VestDealTokens />
      </LeftSidebarLayout>
    </>
  )
}

export default Vest
