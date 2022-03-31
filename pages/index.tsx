import type { NextPage } from 'next'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { Button } from '@/src/components/pureStyledComponents/buttons/Button'
import { genericSuspense } from '@/src/components/safeSuspense'
import PoolsListWithFilters from '@/src/page_helpers/PoolsListWithFilters'

const Home: NextPage = () => {
  return (
    <LeftSidebarLayout>
      <Button as="a" href="/pool/create">
        <a>Create Pool</a>
      </Button>
      <br />
      <PoolsListWithFilters />
    </LeftSidebarLayout>
  )
}

export default genericSuspense(Home)
