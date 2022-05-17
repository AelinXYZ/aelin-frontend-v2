import { useState } from 'react'

import { Button } from '@/src/components/pureStyledComponents/buttons/Button'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinPoolTransaction } from '@/src/hooks/contracts/useAelinPoolTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import isDev from '@/src/utils/isDev'
import { AelinPool } from '@/types/typechain'

type Props = {
  pool: ParsedAelinPool
}

function ReleaseFunds({ pool }: Props) {
  const { address } = useWeb3Connection()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()
  const [actionBlocked, setActionBlocked] = useState(false)

  const { estimate: createDealEstimate, execute } = useAelinPoolTransaction(
    pool.address,
    'createDeal',
  )

  const onReleaseFunds = () => {
    const thirtyMins = (isDev ? 30 : 1) * 60
    const args: Parameters<AelinPool['functions']['createDeal']> = [
      pool.investmentToken, // underlyingDealToken
      pool.amountInPool.raw, // purchaseTokenTotal
      pool.amountInPool.raw, // underlyingDealTokenTotal
      thirtyMins, // vestingPeriodDuration
      thirtyMins, // vestingCliffDuration
      thirtyMins, // proRataRedemptionDuration
      0, // openRedemptionDuration
      address as string, // holderAddress
      thirtyMins, // holderFundingDuration
    ]

    setConfigAndOpenModal({
      estimate: () => createDealEstimate(args),

      title: 'Create deal',
      onConfirm: async (txGasOptions: GasOptions) => {
        try {
          const receipt = await execute(args, txGasOptions)
          if (receipt) {
            setActionBlocked(true)
          }
        } catch (error) {
          console.log(error)
        }
      },
    })
  }

  return (
    <Button disabled={isSubmitting || actionBlocked} onClick={onReleaseFunds}>
      Release funds
    </Button>
  )
}

export default ReleaseFunds
