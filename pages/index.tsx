import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { LeftSidebarLayout } from '@/src/components/layout/LeftSidebarLayout'
import { genericSuspense } from '@/src/components/safeSuspense'
import { ChainsValues, chainsConfig, getKeyChainByValue } from '@/src/constants/chains'
import useAelinPools from '@/src/hooks/pools/useAelinPools'
import { getAmountInPool } from '@/src/utils/aelinPool'

const PoolRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Home: NextPage = () => {
  const router = useRouter()
  const { data, error } = useAelinPools()
  if (error) {
    throw error
  }

  return (
    <LeftSidebarLayout>
      {!data
        ? 'Loading...'
        : data.map((pool) => {
            const { chainId, id, name, purchaseTokenDecimals } = pool
            return (
              <PoolRow key={id}>
                <span>{name.slice(0, 20)}</span>
                <span>{chainsConfig[chainId as ChainsValues].name}</span>
                <span>
                  {
                    getAmountInPool({ ...pool, purchaseTokenDecimals: purchaseTokenDecimals || 0 })
                      .formatted
                  }
                </span>
                <button onClick={() => router.push(`/pool/${getKeyChainByValue(chainId)}/${id}`)}>
                  View
                </button>
              </PoolRow>
            )
          })}
    </LeftSidebarLayout>
  )
}

export default genericSuspense(Home)
