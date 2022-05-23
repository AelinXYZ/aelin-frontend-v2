import type { NextPage } from 'next'
import Head from 'next/head'

import { DealsAccepted } from '@/src/components/history/DealsAccepted'
import { DealsFunded } from '@/src/components/history/DealsFunded'
import { DealsSponsored } from '@/src/components/history/DealsSponsored'
import { Deposits } from '@/src/components/history/Deposits'
import { Vests } from '@/src/components/history/Vests'
import { Withdraws } from '@/src/components/history/Withdraws'
import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { SectionIntro } from '@/src/components/section/SectionIntro'
import { SectionTabs } from '@/src/components/section/SectionTabs'

const History: NextPage = () => {
  const items = [
    { value: 'Deposits', key: 'deposits', children: <Deposits /> },
    { value: 'Deals accepted', key: 'deals-accepted', children: <DealsAccepted /> },
    { value: 'Withdraws', key: 'withdraws', children: <Withdraws /> },
    { value: 'Vests', key: 'vests', children: <Vests /> },
    { value: 'Deals sponsored', key: 'deals-sponsored', children: <DealsSponsored /> },
    { value: 'Deals funded', key: 'deals-funded', children: <DealsFunded /> },
  ]

  return (
    <>
      <Head>
        <title>Aelin - History</title>
      </Head>
      <LeftSidebarLayout>
        <SectionIntro backgroundImage="/resources/svg/bg-history.svg" title="History">
          All of your past investments are listed below.
        </SectionIntro>
        <SectionTabs items={items} />
      </LeftSidebarLayout>
    </>
  )
}

export default History
