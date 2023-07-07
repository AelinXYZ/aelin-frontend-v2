import { useState } from 'react'
import styled from 'styled-components'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { Error } from '@/src/components/pureStyledComponents/text/Error'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import {
  AelinUpfrontDealCombined,
  useAelinUpfrontDealTransaction,
} from '@/src/hooks/contracts/useAelinUpfrontDealTransaction'
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

function HolderDepositUpfrontDeal({ pool }: Props) {
  const { isAppConnected } = useWeb3Connection()

  const [holderBalance] = useERC20Call(
    pool.chainId,
    pool.upfrontDeal?.underlyingToken.token || ZERO_ADDRESS,
    'balanceOf',
    [pool.upfrontDeal?.holder || ZERO_ADDRESS],
  )

  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()
  const [disabledAfterDeposit, setDisabledAfterDeposit] = useState(false)

  const method = 'depositUnderlyingTokens'

  const { estimate: estimate, execute: deposit } = useAelinUpfrontDealTransaction(
    pool.upfrontDeal?.address || ZERO_ADDRESS,
    method,
    pool.isDealTokenTransferable,
  )

  const underlyingAmount = pool.upfrontDeal?.underlyingToken.dealAmount.raw || ZERO_BN

  const depositTokens = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions) => {
        await deposit(
          [underlyingAmount] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>,
          txGasOptions,
        )
        setDisabledAfterDeposit(true)
      },
      title: `Fund deal`,
      estimate: () =>
        estimate([underlyingAmount] as Parameters<
          AelinUpfrontDealCombined['functions'][typeof method]
        >),
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

export default genericSuspense(HolderDepositUpfrontDeal)
