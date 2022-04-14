import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { SectionIntro } from '@/src/components/common/SectionIntro'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import PoolsListWithFilters from '@/src/components/pools/PoolsListWithFilters'

const Home: NextPage = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Aelin - Pools List</title>
      </Head>
      <LeftSidebarLayout>
        <SectionIntro
          backgroundImage="resources/svg/bg-pools.svg"
          button={{ title: 'Create pool', onClick: () => router.push('/pool/create') }}
          description="Aelin is a fully decentralized and community-based fundraising protocol. Invest in a pool to access deals brought by sponsors. Aelin does not endorse any pools, follow an investor's best practices in our docs, and do your own research."
          title="Pools"
        />
        <PoolsListWithFilters />
      </LeftSidebarLayout>
    </>
  )
}

export default genericSuspense(Home)
