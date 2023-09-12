import Link from 'next/link'
import styled from 'styled-components'

import { Contents, Wrapper } from '../pools/actions/Wrapper'
import { ButtonGradient } from '../pureStyledComponents/buttons/Button'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { NFT_WAIVER_CONTRACT } from '@/src/constants/misc'
import { useNftWaiverTransaction } from '@/src/hooks/contracts/useNftWaiverTransaction'
import { useBurnAelin } from '@/src/providers/burnAelinProvider'
import { useTransactionModal } from '@/src/providers/transactionModalProvider'

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 30px;
`

const MintNFT: React.FC = () => {
  const { refetchNftContract } = useBurnAelin()

  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { estimate: estimateMintNft, execute: executeMintNft } = useNftWaiverTransaction(
    NFT_WAIVER_CONTRACT,
    'mint',
  )

  const handleMint = () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions) => {
        await executeMintNft([], txGasOptions)
        refetchNftContract()
      },
      title: `Mint NFT`,
      estimate: () => estimateMintNft([]),
    })
  }

  return (
    <Wrapper title={`Mint NFT before swapping`}>
      <Contents>
        To retrieve your share of treasury assets, you must first agree to a waiver, a copy of which
        you can read{' '}
        <Link
          href="https://v2.akord.com/public/vaults/active/boPGU8ShKj0KAcud8BLrzFGEkaIx5WlnBsVVhETG4ME/gallery#public/896532a7-b257-4997-8cf8-302435a915bb"
          target="_blank"
        >
          here
        </Link>
        .<br />
        <br /> By minting the NFT pursuant to the instructions on this page, you will be agreeing to
        the terms of the waiver.
      </Contents>
      <ButtonsWrapper>
        <ButtonGradient disabled={isSubmitting} onClick={handleMint}>
          Mint NFT
        </ButtonGradient>
      </ButtonsWrapper>
    </Wrapper>
  )
}

export default genericSuspense(MintNFT)
