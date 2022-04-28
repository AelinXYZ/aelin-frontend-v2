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
      if (!vestingPeriods) {
        return 0
      }
      const now = new Date().getTime()
      if (now < vestingPeriods.starts.ms) {
        return 0
      } else if (!vestingPeriods?.vesting.ms) {
        return Number(myDealTotal) - Number(totalVested)
      } else {
        const maxTime = now > vestingPeriods.ends.ms ? vestingPeriods.ends.ms : now

        const timeElapsed = maxTime - vestingPeriods.starts.ms
        return (Number(myDealTotal) * timeElapsed) / vestingPeriods.vesting.ms - Number(totalVested)
      }
    }

    setAmountToVest(getAmountToVest())

    const intervalId = setInterval(() => setAmountToVest(getAmountToVest()), 1000)

    return () => clearInterval(intervalId)
  }, [vestingPeriods, totalVested, myDealTotal])

  return amountToVest
}
