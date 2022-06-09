import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { ListWithFilters } from '@/src/components/pools/list/ListWithFilters'
import { SectionIntro } from '@/src/components/section/SectionIntro'
import useAelinUser from '@/src/hooks/aelin/useAelinUser'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Home: NextPage = () => {
  const router = useRouter()
  const { address } = useWeb3Connection()
  const { data: userResponse } = useAelinUser(address)

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
          Aelin is a decentralized and community-based fundraising protocol. Invest in a pool to
          access deals brought by sponsors. Aelin does not endorse any pools, follow an investor's
          best practices in our docs, and do your own research.
        </SectionIntro>
        <ListWithFilters userPoolsInvested={userResponse?.poolsInvested} />
      </LeftSidebarLayout>
    </>
  )
}

export default Home
