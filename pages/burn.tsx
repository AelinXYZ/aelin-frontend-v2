import type { NextPage } from 'next'
import Head from 'next/head'

import BurnAelin from '@/src/components/burn/BurnAelin'
import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { SectionIntro } from '@/src/components/section/SectionIntro'

const Stats: NextPage = () => {
  return (
    <>
      <Head>
        <title>Aelin - Swap/Burn</title>
      </Head>
      <LeftSidebarLayout>
        <SectionIntro
          backgroundImage="/resources/svg/bg-sponsors.svg"
          backgroundPosition="100% 100px"
          title="Swap/Burn AELIN Tokens"
        >
          Three transactions in total are necessary to claim your share of treasury assets. <br />
          1) You must first agree to a waiver by minting a NFT.
          <br />
          2) You must approve your AELIN tokens to be moved by our swap contract. <br />
          3) You must call the swap method to burn your AELIN for a share of treasury assets.
        </SectionIntro>
        <BurnAelin />
      </LeftSidebarLayout>
    </>
  )
}

export default Stats
