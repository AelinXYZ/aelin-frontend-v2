import styled from 'styled-components'

import { Contents, Wrapper } from '../pools/actions/Wrapper'
import { ButtonGradient } from '../pureStyledComponents/buttons/Button'
import { TextPrimary } from '../pureStyledComponents/text/Text'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BURN_AELIN_CONTRACT } from '@/src/constants/misc'
import { useSwapAelinTransaction } from '@/src/hooks/contracts/useSwapAelinTransaction'
import { useBurnAelin } from '@/src/providers/burnAelinProvider'
import { useTransactionModal } from '@/src/providers/transactionModalProvider'

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 30px;
`

const SwapAelinToken: React.FC = () => {
  const {
    refetchUserBalance,
    setHasSwapped,
    setSwapTransactionHash,
    userBalance,
    userReceiveAmtUSDC,
    userReceiveAmtVK,
  } = useBurnAelin()

  const { refetchNftContract } = useBurnAelin()

  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { estimate: estimateBurn, execute: executeBurn } = useSwapAelinTransaction(
    BURN_AELIN_CONTRACT,
    'burn',
  )

  const handleSwapTokens = () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions) => {
        const res = await executeBurn([userBalance], txGasOptions)
        refetchUserBalance()
        setHasSwapped(true)
        setSwapTransactionHash(res?.transactionHash || '')
        refetchNftContract()
      },
      title: `Swap/Burn AELIN Tokens`,
      estimate: () => estimateBurn([userBalance]),
    })
  }

  return (
    <Wrapper title={`Swap Tokens`}>
      <Contents>
        Call the swap method to burn your AELIN for a share of treasury assets
        <br />
        <br />
        You'll receive <TextPrimary>{userReceiveAmtUSDC} USDC</TextPrimary> and{' '}
        <TextPrimary>{userReceiveAmtVK} veKWENTA</TextPrimary>
      </Contents>
      <ButtonsWrapper>
        <ButtonGradient disabled={isSubmitting} onClick={handleSwapTokens}>
          Swap
        </ButtonGradient>
      </ButtonsWrapper>
    </Wrapper>
  )
}

export default genericSuspense(SwapAelinToken)
