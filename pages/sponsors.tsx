import type { NextPage } from 'next'
import Head from 'next/head'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { SectionIntro } from '@/src/components/section/SectionIntro'
import List from '@/src/components/sponsors/List'

const Sponsors: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aelin - Sponsors</title>
      </Head>
      <LeftSidebarLayout>
        <SectionIntro
          backgroundImage="/resources/svg/bg-sponsors.svg"
          backgroundPosition="100% 100px"
          title="Sponsors"
        >
          Learn more about the sponsors presenting deals on Aelin by viewing all of their past
          pools. Sponsors may have real-world experience / other experience that isn't reflected in
          the information below.
        </SectionIntro>
        <List />
      </LeftSidebarLayout>
    </>
  )
}

export default Sponsors
