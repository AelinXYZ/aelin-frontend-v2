import { useEffect, useState } from 'react'

import ms from 'ms'

import { ChainsValues } from '@/src/constants/chains'
import useAelinPool from '@/src/hooks/aelin/useAelinPool'
import { getAelinPoolCurrentStatus } from '@/src/utils/getAelinPoolCurrentStatus'

export default function useAelinPoolStatus(chainId: ChainsValues, poolAddress: string) {
  const { pool: poolResponse, refetch } = useAelinPool(chainId, poolAddress, {
    refreshInterval: ms('30s'),
  })
  const [currentState, setCurrentState] = useState(getAelinPoolCurrentStatus(poolResponse))

  useEffect(() => {
    setCurrentState(getAelinPoolCurrentStatus(poolResponse))
  }, [poolResponse])

  return { refetch, currentState, pool: poolResponse }
}
