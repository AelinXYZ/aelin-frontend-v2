import { useEffect, useMemo, useState } from 'react'

import useAelinPool from './useAelinPool'
import { ChainsValues } from '@/src/constants/chains'

export default function useAelinClaimableTokens(
  poolAddress: string,
  chainId: ChainsValues,
  myDealTotal: string,
  totalVested: string,
) {
  const {
    pool: { deal },
  } = useAelinPool(chainId, poolAddress)

  const vestingPeriods = useMemo(() => {
    if (deal) {
      return deal.vestingPeriod
    }
  }, [deal])

  const [amountToVest, setAmountToVest] = useState<number>(0)

  useEffect(() => {
    const getAmountToVest = () => {
      if (!vestingPeriods || !vestingPeriods.start || !vestingPeriods.end) {
        return 0
      }
      const now = new Date().getTime()
      if (now < vestingPeriods.start.getTime()) {
        return 0
      } else if (!vestingPeriods?.vesting.ms) {
        return Number(myDealTotal) - Number(totalVested)
      } else {
        const maxTime = now > vestingPeriods.end.getTime() ? vestingPeriods.end.getTime() : now

        const timeElapsed = maxTime - vestingPeriods.start.getTime()
        return (Number(myDealTotal) * timeElapsed) / vestingPeriods.vesting.ms - Number(totalVested)
      }
    }

    setAmountToVest(getAmountToVest())

    const intervalId = setInterval(() => setAmountToVest(getAmountToVest()), 1000)

    return () => clearInterval(intervalId)
  }, [vestingPeriods, totalVested, myDealTotal])

  return amountToVest
}
