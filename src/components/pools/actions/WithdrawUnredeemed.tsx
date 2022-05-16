import { useMemo } from 'react'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinPoolDealTransaction } from '@/src/hooks/contracts/useAelinPoolDealTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type Props = {
  pool: ParsedAelinPool
  refetch: () => void
}

function WithdrawUnredeemed({ pool, refetch }: Props) {
  const { deal, dealAddress } = pool
  const { address, isAppConnected } = useWeb3Connection()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

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
          refetch()
        }
      },
      title: `Withdraw ${deal?.underlyingToken.symbol}`,
      estimate: () => withdrawExpiryEstimate([]),
    })
  }

  const disableButton = useMemo(
    () => !address || !isAppConnected || isSubmitting,
    [address, isAppConnected, isSubmitting],
  )

  return (
    <>
      <div>Withdraw unredeemed tokens</div>
      <p>Deal tokens that have been rejected by the purchasers</p>
      <div>
        <div>Amount to withdraw :</div>
        <div>{unredeemed}</div>
      </div>
      <GradientButton disabled={disableButton} onClick={withdrawUnredeemed}>
        Withdraw {unredeemed}
      </GradientButton>
    </>
  )
}

export default genericSuspense(WithdrawUnredeemed)
