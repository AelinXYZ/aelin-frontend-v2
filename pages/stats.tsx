import type { NextPage } from 'next'
import Head from 'next/head'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { SectionIntro } from '@/src/components/section/SectionIntro'
import List from '@/src/components/stats/List'

const Stats: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aelin - Stats</title>
      </Head>
      <LeftSidebarLayout>
        <SectionIntro
          backgroundImage="/resources/svg/bg-sponsors.svg"
          backgroundPosition="100% 100px"
          title="Stats"
        >
          This section provides information about vouchers, investors and sponsors who interact with
          the aelin protocol.
        </SectionIntro>
        <List />
      </LeftSidebarLayout>
    </>
  )
}

export default Stats
