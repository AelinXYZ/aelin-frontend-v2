import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { ListWithFilters } from '@/src/components/pools/list/ListWithFilters'
import { VouchedPools } from '@/src/components/pools/list/Vouched'
import { ButtonType } from '@/src/components/pureStyledComponents/buttons/Button'
import { SectionIntro } from '@/src/components/section/SectionIntro'
import useAelinUser from '@/src/hooks/aelin/useAelinUser'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 1.5rem;
`

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
        <Container>
          <SectionIntro
            backgroundImage="/resources/svg/bg-deals.svg"
            backgroundPosition="100% 110%"
            button={[
              {
                title: 'Create deal',
                onClick: () => router.push('/deal/create'),
                type: ButtonType.Secondary,
              },
            ]}
            title="Deals"
          >
            Direct Deals are for new and established protocols looking to raise capital from
            investors at pre-established deal terms. Aelin Deals allow for customizable features,
            such as a defined vesting period and a vesting cliff.
          </SectionIntro>
          <SectionIntro
            backgroundImage="/resources/svg/bg-pools.svg"
            backgroundPosition="100% 120px"
            button={[
              {
                title: 'Create pool',
                onClick: () => router.push('/pool/create'),
                type: ButtonType.Primary,
              },
            ]}
            title="Pools"
          >
            Pools are for protocols/sponsors that don't have set deal terms yet but are gauging
            investor interest. Pools are best suited for protocols without a set target valuation
            and sponsors using Aelin to source a future deal. Aelin Pools are most similar to SPACs.
          </SectionIntro>
        </Container>

        <VouchedPools />
        <ListWithFilters userPoolsInvested={userResponse?.poolsInvested} />
      </LeftSidebarLayout>
    </>
  )
}

export default Home
