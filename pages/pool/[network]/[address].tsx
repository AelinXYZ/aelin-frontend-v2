import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import nullthrows from 'nullthrows'

import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { genericSuspense } from '@/src/components/safeSuspense'
import { Chains, ChainsKeys } from '@/src/constants/chains'
import useAelinPool from '@/src/hooks/useAelinPool'

const PoolDetails: NextPage = () => {
  const router = useRouter()
  const { address, network } = router.query

  const chainId = nullthrows(
    Object.keys(Chains).includes(network as string) ? Chains[network as ChainsKeys] : null,
    'Unsupported chain passed as url parameter.',
  )

  const { amountInPool, funded, withdrawn } = useAelinPool(chainId, address as string)

  return (
    <RightTimelineLayout timeline={<>Timeline stuff</>}>
      <BaseCard>
        <div>Pool details: {address}</div>
        <div>Funded: {funded.formatted}</div>
        <div>Withdrawn: {withdrawn.formatted}</div>
        <div>Amount in Pool: {amountInPool.formatted}</div>
      </BaseCard>
    </RightTimelineLayout>
  )
}

export default genericSuspense(PoolDetails, () => <div>Loading..</div>)
