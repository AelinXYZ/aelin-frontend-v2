import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'

import { SectionIntro } from '@/src/components/common/SectionIntro'
import { SectionTabs } from '@/src/components/common/SectionTabs'
import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'

const History: NextPage = () => {
  const [activeTab, setActiveTab] = useState('')
  const items = [
    'Deposits',
    'Deals accepted',
    'Withdraws',
    'Vests',
    'Deals sponsored',
    'Deals funded',
  ]

  const onSetActiveTab = (item: string) => {
    setActiveTab(item)
  }

  return (
    <>
      <Head>
        <title>Aelin - History</title>
      </Head>
      <LeftSidebarLayout>
        <SectionIntro backgroundImage="resources/svg/bg-history.svg" title="History">
          All of your past investments are listed below.
        </SectionIntro>
        <SectionTabs items={items} onClick={onSetActiveTab} />
        {activeTab === items[0] && <>Deposits</>}
        {activeTab === items[1] && <>Deals accepted</>}
        {activeTab === items[2] && <>Withdraws</>}
        {activeTab === items[3] && <>Vests</>}
        {activeTab === items[4] && <>Deals sponsored</>}
        {activeTab === items[5] && <>Deals funded</>}
      </LeftSidebarLayout>
    </>
  )
}

export default History
