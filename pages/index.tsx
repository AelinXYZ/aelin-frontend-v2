import type { NextPage } from 'next'
import Head from 'next/head'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { ListWithFilters } from '@/src/components/pools/list/ListWithFilters'
import { VouchedPools } from '@/src/components/pools/list/Vouched'
import { ThemeType } from '@/src/constants/types'
import useAelinUser from '@/src/hooks/aelin/useAelinUser'
import { useThemeContext } from '@/src/providers/themeContextProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

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
        <VouchedPools />
        {!isLizardTheme && <ListWithFilters userPoolsInvested={userResponse?.poolsInvested} />}
      </LeftSidebarLayout>
    </>
  )
}

export default Home
