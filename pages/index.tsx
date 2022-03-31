import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { SectionIntro } from '@/src/components/common/SectionIntro'
import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { genericSuspense } from '@/src/components/safeSuspense'
import PoolsListWithFilters from '@/src/page_helpers/PoolsListWithFilters'

const Home: NextPage = () => {
  const router = useRouter()

  return (
    <LeftSidebarLayout>
      <SectionIntro
        backgroundImage="resources/svg/bg-pools.svg"
        button={{ title: 'Create pool', onClick: () => router.push('/create-pool') }}
        description="Aelin is a fully decentralized and community-based fundraising protocol. Invest in a pool to access deals brought by sponsors. Aelin does not endorse any pools, follow an investor's best practices in our docs, and do your own research."
        title="Pools"
      />
      <PoolsListWithFilters />
    </LeftSidebarLayout>
  )
}

export default genericSuspense(Home)
