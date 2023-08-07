import { useState } from 'react'
import styled from 'styled-components'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { Error } from '@/src/components/pureStyledComponents/text/Error'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinPoolDealTransaction } from '@/src/hooks/contracts/useAelinPoolDealTransaction'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useTransactionModal } from '@/src/providers/transactionModalProvider'
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

const ErrorText = styled(Error)`
  text-align: center;
`

function HolderDeposit({ pool }: Props) {
  const { isAppConnected } = useWeb3Connection()
  const [holderBalance] = useERC20Call(
    pool.chainId,
    pool.deal?.underlyingToken.token || ZERO_ADDRESS,
    'balanceOf',
    [pool.deal?.holderAddress || ZERO_ADDRESS],
  )
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()
  const [disabledAfterDeposit, setDisabledAfterDeposit] = useState(false)

  const { estimate, execute: deposit } = useAelinPoolDealTransaction(
    pool.dealAddress || ZERO_ADDRESS,
    'depositUnderlying',
  )

  const underlyingAmount = pool.deal?.underlyingToken.dealAmount.raw || ZERO_BN

  const depositTokens = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions) => {
        await deposit([underlyingAmount], txGasOptions)
        setDisabledAfterDeposit(true)
      },
      title: `Fund deal`,
      estimate: () => estimate([underlyingAmount]),
    })
  }

  const noEnoughBalance = (holderBalance || ZERO_BN).lt(underlyingAmount)

  return (
    <>
      <ButtonsWrapper>
        <ButtonGradient
          disabled={!isAppConnected || isSubmitting || disabledAfterDeposit || noEnoughBalance}
          onClick={depositTokens}
        >
          Fund Deal
        </ButtonGradient>
      </ButtonsWrapper>
      {noEnoughBalance && <ErrorText>Insufficient balance</ErrorText>}
    </>
  )
}

export default genericSuspense(HolderDeposit)
