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
          title="Fees"
        >
          This section provides information about fees collected by the aelin protocol.
        </SectionIntro>
        <ListWithFilters />
      </LeftSidebarLayout>
    </>
  )
}

export default Fees
