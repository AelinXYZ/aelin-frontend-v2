import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { InnerContainer } from '@/src/components/pureStyledComponents/layout/InnerContainer'
import { genericSuspense } from '@/src/components/safeSuspense'
import { Chains } from '@/src/constants/chains'
import { getAmountInPool } from '@/src/utils/aelintPool'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'

const PoolRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Home: NextPage = () => {
  const router = useRouter()
  const allSDK = getAllGqlSDK()
  const { usePoolsCreated } = allSDK[Chains.optimism]
  const { data, error } = usePoolsCreated()

  if (!data) {
    return <div>no pools</div>
  }

  if (error) {
    throw error
  }

  return (
    <InnerContainer>
      {data.poolCreateds.map((pool) => {
        const { id, name, purchaseTokenDecimals } = pool
        return (
          <PoolRow key={id}>
            <span>{name.slice(0, 20)}</span>
            <span>
              {
                getAmountInPool({ ...pool, purchaseTokenDecimals: purchaseTokenDecimals || 0 })
                  .formatted
              }
            </span>
            <button onClick={() => router.push(`/pool/optimism/${id}`)}>View</button>
          </PoolRow>
        )
      })}
    </InnerContainer>
  )
}

export default genericSuspense(Home)
