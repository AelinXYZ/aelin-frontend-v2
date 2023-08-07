import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styled from 'styled-components'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { ListWithFilters } from '@/src/components/pools/list/ListWithFilters'
import { VouchedPools } from '@/src/components/pools/list/Vouched'
import { SectionIntro as BaseSectionIntro } from '@/src/components/section/SectionIntro'
import { ThemeType } from '@/src/constants/types'
import useAelinUser from '@/src/hooks/aelin/useAelinUser'
import { useThemeContext } from '@/src/providers/themeContextProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 1.5rem;
  height: 350px;
`

const SectionIntro = styled(BaseSectionIntro)`
  display: flex;
  flex-direction: column;
  flex: 1 1 0px;
  justify-content: space-between;
  height: 300px;
`

const Home: NextPage = () => {
  const { address } = useWeb3Connection()
  const { data: userResponse } = useAelinUser(address)

  const { currentThemeName } = useThemeContext()

  const isLizardTheme = currentThemeName === ThemeType.ethlizards

  return (
    <>
      <Head>
        <title>Aelin - Pools List</title>
      </Head>
      <LeftSidebarLayout>
        <Container>
          <SectionIntro
            backgroundImage={
              isLizardTheme ? `/resources/lizards/violet-lizard.png` : `/resources/svg/bg-deals.svg`
            }
            backgroundPosition="100% 110%"
            backgroundSize={isLizardTheme ? '100px 85px' : 'auto auto'}
            button={[]}
            title=""
          >
            The Aelin Council has unanimously proposed that core contributors stop working on the
            Aelin Protocol. Over the past 2 years, the CCs and Council have worked tirelessly to
            build Aelin. Despite their best efforts, Aelin was unable to gain the level of usage
            needed for the protocol to be sustainable. <br />
            The full governance proposal, AELIP-53, can be found at this link with more details:{' '}
            <Link href="https://aelips.aelin.xyz/aelips/aelip-53/">
              https://aelips.aelin.xyz/aelips/aelip-53/
            </Link>
          </SectionIntro>
        </Container>
        <VouchedPools />
        {!isLizardTheme && <ListWithFilters userPoolsInvested={userResponse?.poolsInvested} />}
      </LeftSidebarLayout>
    </>
  )
}

export default Home
