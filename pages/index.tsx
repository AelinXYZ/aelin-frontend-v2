import type { NextPage } from 'next'

import { InnerContainer } from '@/src/components/pureStyledComponents/layout/InnerContainer'
import { genericSuspense } from '@/src/components/safeSuspense'
import { Chains } from '@/src/constants/chains'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'

const Home: NextPage = () => {
  const allSDK = getAllGqlSDK()
  console.log({ allSDK })
  const { usePoolsCreated } = allSDK[Chains.mainnet]
  const { data, error } = usePoolsCreated()

  if (!data) {
    return <div>no pools</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <InnerContainer>
      {/* {data.poolCreateds.map(({ id, name }) => (
        <div key={id}>
          ID: {id} - Name: {name}
        </div>
      ))} */}
    </InnerContainer>
  )
}

export default genericSuspense(Home)
