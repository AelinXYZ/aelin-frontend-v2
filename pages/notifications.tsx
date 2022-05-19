import type { NextPage } from 'next'
import Head from 'next/head'

import { SectionIntro } from '@/src/components/common/SectionIntro'
import { List } from '@/src/components/notifications/List'

const Notifications: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aelin - Notifications</title>
      </Head>
      <SectionIntro backgroundImage="/resources/svg/bg-notifications.svg" title="Notifications">
        Investors will receive notifications about investment pool stages, required actions, vesting
        periods, and other important information. Check back often to stay up to date on your
        investments.
      </SectionIntro>
      <List />
    </>
  )
}

export default Notifications
