import type { NextPage } from 'next'
import Head from 'next/head'

import { SectionIntro } from '@/src/components/common/SectionIntro'
import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'

const History: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aelin - History</title>
      </Head>
      <LeftSidebarLayout>
        <SectionIntro backgroundImage="resources/svg/bg-history.svg" title="History">
          All of your past investments are listed below.
        </SectionIntro>
      </LeftSidebarLayout>
    </>
  )
}

export default History
