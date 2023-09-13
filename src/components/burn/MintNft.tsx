import Link from 'next/link'
import styled from 'styled-components'

import { Contents, Wrapper } from '../pools/actions/Wrapper'
import { ButtonGradient } from '../pureStyledComponents/buttons/Button'
import { TextPrimary } from '../pureStyledComponents/text/Text'
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
  const { refetchNftContract, userReceiveAmtUSDC, userReceiveAmtVK } = useBurnAelin()

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
          href="https://v2.akord.com/public/vaults/active/2KzfEiio_umg2tFNymCwSp6qt7Yu4phwvqlsQ1b9u4s/gallery#public/92f85237-3912-4c09-b9b2-a89821b20e90"
          target="_blank"
        >
          here
        </Link>{' '}
        or{' '}
        <Link
          href="https://arweave.net/VQi16G-BBzDThczwc1SNyd4WQ8frVip-chmENhh0Cpw"
          target="_blank"
        >
          here
        </Link>
        .<br />
        <br /> By minting the NFT pursuant to the instructions on this page, you will be agreeing to
        the terms of the waiver.
        <br />
        <br />
        After swapping you'll receive <TextPrimary>{userReceiveAmtUSDC} USDC</TextPrimary> and{' '}
        <TextPrimary>{userReceiveAmtVK} veKWENTA</TextPrimary>
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
