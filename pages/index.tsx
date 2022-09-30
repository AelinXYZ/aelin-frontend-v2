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
  height: 100%;
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
            backgroundImage="/resources/svg/bg-pools.svg"
            button={[
              {
                title: 'Create deal',
                onClick: () => router.push('/deal/create'),
                type: ButtonType.Secondary,
              },
            ]}
            title="Deals"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </SectionIntro>
          <SectionIntro
            backgroundImage="/resources/svg/bg-pools.svg"
            button={[
              {
                title: 'Create pool',
                onClick: () => router.push('/pool/create'),
                type: ButtonType.Primary,
              },
            ]}
            title="Pools"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </SectionIntro>
        </Container>

        <VouchedPools />
        <ListWithFilters userPoolsInvested={userResponse?.poolsInvested} />
      </LeftSidebarLayout>
    </>
  )
}

export default Home
