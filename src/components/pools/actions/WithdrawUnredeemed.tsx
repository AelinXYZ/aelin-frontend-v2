import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { TextPrimary } from '@/src/components/pureStyledComponents/text/Text'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinPoolDealTransaction } from '@/src/hooks/contracts/useAelinPoolDealTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type Props = {
  pool: ParsedAelinPool
}

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 15px;
`

function WithdrawUnredeemed({ pool }: Props) {
  const { deal, dealAddress } = pool
  const { address, isAppConnected } = useWeb3Connection()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()
  const [withdrew, setWithdrew] = useState<boolean>(false)

  const unredeemed = deal?.unredeemed.formatted || '0'

  const { estimate: withdrawExpiryEstimate, execute } = useAelinPoolDealTransaction(
    dealAddress || ZERO_ADDRESS,
    'withdrawExpiry',
  )

  const withdrawUnredeemed = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await execute([], txGasOptions)
        if (receipt) {
          setWithdrew(true)
        }
      },
      title: `Withdraw ${deal?.underlyingToken.symbol}`,
      estimate: () => withdrawExpiryEstimate([]),
    })
  }

  const disableButton = useMemo(
    () => !address || !isAppConnected || isSubmitting || withdrew,
    [address, isAppConnected, isSubmitting, withdrew],
  )

  return (
    <Wrapper title="Withdraw unredeemed tokens">
      <Contents style={{ marginBottom: '18px' }}>
        Deal tokens that have been rejected by the purchasers
      </Contents>
      <Contents>
        Amount to withdraw:{` `}
        <TextPrimary>
          {unredeemed} {pool.deal?.underlyingToken.symbol || ''}
        </TextPrimary>
      </Contents>
      <ButtonsWrapper>
        <ButtonGradient disabled={disableButton} onClick={withdrawUnredeemed}>
          Withdraw
        </ButtonGradient>
      </ButtonsWrapper>
    </Wrapper>
  )
}

export default genericSuspense(WithdrawUnredeemed)
