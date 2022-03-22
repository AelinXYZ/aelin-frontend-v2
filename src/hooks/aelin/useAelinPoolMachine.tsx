import { useEffect } from 'react'

import { useMachine } from '@xstate/react'

import { ChainsValues } from '@/src/constants/chains'
import useAelinPool from '@/src/hooks/useAelinPool'
import { aelinPoolMachine } from '@/src/xStateModels/aelinPoolModel'

export default function useAelinPoolMachine(chainId: ChainsValues, poolAddress: string) {
  const { pool: poolResponse, refetch } = useAelinPool(chainId, poolAddress, {
    refreshInterval: 1000 * 30,
  })
  const [state, send] = useMachine(aelinPoolMachine)

  useEffect(() => {
    send('POOL_UPDATED', { pool: poolResponse })
  }, [poolResponse, send])

  return { refetch, state, send }
}
