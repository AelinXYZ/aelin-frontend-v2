import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'

import { SectionIntro } from '@/src/components/common/SectionIntro'
import { SectionTabs } from '@/src/components/common/SectionTabs'
import { DealsAccepted } from '@/src/components/history/DealsAccepted'
import { Deposits } from '@/src/components/history/Deposits'
import { Vests } from '@/src/components/history/Vests'
import { Withdraws } from '@/src/components/history/Withdraws'
import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'

const History: NextPage = () => {
  const items = [
    'Deposits',
    'Deals accepted',
    'Withdraws',
    'Vests',
    'Deals sponsored',
    'Deals funded',
  ]
  const [activeTab, setActiveTab] = useState(items[0])

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
        {activeTab === items[0] && <Deposits />}
        {activeTab === items[1] && <DealsAccepted />}
        {activeTab === items[2] && <Withdraws />}
        {activeTab === items[3] && <Vests />}
        {activeTab === items[4] && <>Deals sponsored</>}
        {activeTab === items[5] && <>Deals funded</>}
      </LeftSidebarLayout>
    </>
  )
}

export default History
