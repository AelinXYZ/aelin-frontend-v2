import { useCallback, useEffect, useState } from 'react'

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import isAfter from 'date-fns/isAfter'
import ms from 'ms'

import useAelinPool from './useAelinPool'
import { ChainsValues } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'

export default function useAelinClaimableTokens(
  poolAddress: string,
  chainId: ChainsValues,
  totalAmount: BigNumberish,
  totalVested: BigNumberish,
) {
  const {
    pool: { deal },
  } = useAelinPool(chainId, poolAddress)

  const [amountToVest, setAmountToVest] = useState<BigNumber>(ZERO_BN)

  const getAmountToVest = useCallback(() => {
    const now = new Date()

    if (!deal?.vestingPeriod.start || !deal?.vestingPeriod.end) {
      return setAmountToVest(ZERO_BN)
    }

    const isVestingCliffEnds = isAfter(now, deal?.vestingPeriod.start as Date)
    const isVestindPeriodEnds = isAfter(now, deal?.vestingPeriod.end as Date)

    if (!isVestingCliffEnds) {
      return setAmountToVest(ZERO_BN)
    }

    if (isVestindPeriodEnds) {
      const amountToVest = BigNumber.from(totalAmount).sub(BigNumber.from(totalVested))
      return setAmountToVest(amountToVest)
    }

    const timeElapsed = now.getTime() - deal?.vestingPeriod?.start.getTime()

    const amountToVest = BigNumber.from(totalAmount)
      .mul(timeElapsed)
      .div(deal.vestingPeriod.vesting.ms)
      .sub(BigNumber.from(totalVested))

    // Fake fix
    setAmountToVest(amountToVest.lt(ZERO_BN) ? ZERO_BN : amountToVest)
  }, [
    deal?.vestingPeriod.end,
    deal?.vestingPeriod.start,
    deal?.vestingPeriod.vesting.ms,
    totalAmount,
    totalVested,
  ])

  useEffect(() => {
    getAmountToVest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => getAmountToVest(), ms('5s'))

    return () => clearInterval(intervalId)
  }, [getAmountToVest])

  return amountToVest
}
