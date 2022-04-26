import type { NextPage } from 'next'
import Head from 'next/head'

import { SectionIntro } from '@/src/components/common/SectionIntro'
import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'

const Notifications: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aelin - Notifications</title>
      </Head>
      <LeftSidebarLayout>
        <SectionIntro backgroundImage="/resources/svg/bg-notifications.svg" title="Notifications">
          Investors will receive notifications about investment pool stages, required actions,
          vesting periods, and other important information. Check back often to stay up to date on
          your investments.
        </SectionIntro>
      </LeftSidebarLayout>
    </>
  )
}

export default Notifications
