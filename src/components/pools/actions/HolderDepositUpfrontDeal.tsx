import { useState } from 'react'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinPoolUpfrontDealTransaction } from '@/src/hooks/contracts/useAelinPoolUpfrontDealTransaction'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type Props = {
  pool: ParsedAelinPool
}

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

  const { estimate: estimate, execute: deposit } = useAelinPoolUpfrontDealTransaction(
    pool.upfrontDeal?.address || ZERO_ADDRESS,
    'depositUnderlyingTokens',
  )

  const underlyingAmount = pool.upfrontDeal?.underlyingToken.dealAmount.raw || ZERO_BN

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
  return (
    <>
      <ButtonGradient
        disabled={
          !isAppConnected ||
          isSubmitting ||
          disabledAfterDeposit ||
          (holderBalance || ZERO_BN).lt(underlyingAmount)
        }
        onClick={depositTokens}
      >
        Fund Deal
      </ButtonGradient>
    </>
  )
}

export default genericSuspense(HolderDepositUpfrontDeal)
