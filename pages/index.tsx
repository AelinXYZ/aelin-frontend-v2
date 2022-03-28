import type { NextPage } from 'next'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { LinkButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { genericSuspense } from '@/src/components/safeSuspense'
import PoolsListWithFilters from '@/src/page_helpers/PoolsListWithFilters'

const Home: NextPage = () => {
  return (
    <LeftSidebarLayout>
      <LinkButton href="/pool/create" passHref>
        <a>Create Pool</a>
      </LinkButton>
      <br />
      <PoolsListWithFilters />
    </LeftSidebarLayout>
  )
}

export default genericSuspense(Home)
