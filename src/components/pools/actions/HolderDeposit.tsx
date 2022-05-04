import { useState } from 'react'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinPoolDealTransaction } from '@/src/hooks/contracts/useAelinPoolDealTransaction'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type Props = {
  pool: ParsedAelinPool
}

function HolderDeposit({ pool }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const { isAppConnected } = useWeb3Connection()
  const [holderBalance] = useERC20Call(
    pool.chainId,
    pool.deal?.underlyingToken.token || ZERO_ADDRESS,
    'balanceOf',
    [pool.deal?.holderAddress || ZERO_ADDRESS],
  )

  const deposit = useAelinPoolDealTransaction(pool.dealAddress || ZERO_ADDRESS, 'depositUnderlying')

  const underlyingAmount = pool.deal?.underlyingToken.dealAmount.raw || ZERO_BN

  const depositTokens = async () => {
    setIsLoading(true)

    try {
      await deposit([underlyingAmount])
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <>
      <GradientButton
        disabled={!isAppConnected || isLoading || (holderBalance || ZERO_BN).lt(underlyingAmount)}
        onClick={depositTokens}
      >
        {`Fund ${pool.deal?.underlyingToken.dealAmount.formatted} ${pool.deal?.underlyingToken.symbol}`}
      </GradientButton>
    </>
  )
}

export default genericSuspense(HolderDeposit)
