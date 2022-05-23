import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { ListWithFilters } from '@/src/components/pools/list/ListWithFilters'
import { SectionIntro } from '@/src/components/section/SectionIntro'

const Home: NextPage = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Aelin - Pools List</title>
      </Head>
      <LeftSidebarLayout>
        <SectionIntro
          backgroundImage="/resources/svg/bg-pools.svg"
          button={{ title: 'Create pool', onClick: () => router.push('/pool/create') }}
          title="Pools"
        >
          Aelin is a fully decentralized and community-based fundraising protocol. Invest in a pool
          to access deals brought by sponsors. Aelin does not endorse any pools, follow an
          investor's best practices in our docs, and do your own research.
        </SectionIntro>
        <ListWithFilters />
      </LeftSidebarLayout>
    </>
  )
}

export default Home
