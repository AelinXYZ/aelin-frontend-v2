import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import NftsPickerModal from '@/src/components/pools/actions/NftsPickerModal'
import { ListWithFilters } from '@/src/components/pools/list/ListWithFilters'
import { VouchedPools } from '@/src/components/pools/list/Vouched'
import { NftWhitelistProcess } from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { SectionIntro } from '@/src/components/section/SectionIntro'
import useAelinUser from '@/src/hooks/aelin/useAelinUser'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Home: NextPage = () => {
  const router = useRouter()
  const { address } = useWeb3Connection()
  const { data: userResponse } = useAelinUser(address)
  // TODO [AELIP-15]: Just for testing, will move in investment section in next PR.
  const [showNftsPickerModal, setShowNftsPickerModal] = useState<boolean>(false)

  return (
    <>
      <Head>
        <title>Aelin - Pools List</title>
      </Head>
      <LeftSidebarLayout>
        <SectionIntro
          backgroundImage="/resources/svg/bg-pools.svg"
          button={{ title: 'Create pool', onClick: () => setShowNftsPickerModal(true) }}
          title="Pools"
        >
          Aelin is a decentralized and community-based fundraising protocol. Invest in a pool to
          access deals brought by sponsors. Aelin does not endorse any pools, follow an investor's
          best practices in our docs, and do your own research.
        </SectionIntro>
        <VouchedPools />
        <ListWithFilters userPoolsInvested={userResponse?.poolsInvested} />
      </LeftSidebarLayout>
      {showNftsPickerModal && (
        <NftsPickerModal
          allocationCurrency="USDC"
          blacklistNfts={{
            '0x0000000000000000000000000000000000000001': new Set(['5']),
            '0x0000000000000000000000000000000000000003': new Set(['3']),
          }}
          nftWhitelistProcess={NftWhitelistProcess.limitedPerNft}
          onClose={() => setShowNftsPickerModal(false)}
          onSave={(selectedNfts) => {
            setShowNftsPickerModal(false)
            console.log('xxx selectedNfts', selectedNfts)
          }}
          whitelistRules={{
            '0x0000000000000000000000000000000000000001': {
              amountPerWallet: 1,
              amountPerNft: 10,
              nftsMinimumAmounts: {},
            },
            '0x0000000000000000000000000000000000000003': {
              amountPerWallet: 2,
              amountPerNft: 100,
              nftsMinimumAmounts: {},
            },
          }}
        />
      )}
    </>
  )
}

export default Home
