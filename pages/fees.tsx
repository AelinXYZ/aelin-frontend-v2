import type { NextPage } from 'next'
import Head from 'next/head'

import { ListWithFilters } from '@/src/components/fees/ListWithFilters'
import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { SectionIntro } from '@/src/components/section/SectionIntro'

const Fees: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aelin - Fees</title>
      </Head>
      <LeftSidebarLayout>
        <SectionIntro
          backgroundImage="/resources/svg/bg-fees.svg"
          backgroundPosition="100% 100%"
          title="Protocol fees"
        >
          This section shows the amount of deal fees collected by Aelin protocol and allows AELIN
          stakers to claim their share of deal fees.
        </SectionIntro>
        <ListWithFilters />
      </LeftSidebarLayout>
    </>
  )
}

export default Fees
