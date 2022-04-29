import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import { isAddress } from '@ethersproject/address'
import nullthrows from 'nullthrows'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import CreateDealForm from '@/src/components/pools/deal/CreateDealForm'
import { Chains, ChainsKeys } from '@/src/constants/chains'

const CreateDeal: NextPage = () => {
  const router = useRouter()
  const { address: poolAddress, network } = router.query

  if (!poolAddress || !network) {
    return <div>No address or network provided</div>
  }

  if (!isAddress((poolAddress as string).toLowerCase())) {
    return <div>No valid network provided</div>
  }

  const chainId = nullthrows(
    Object.keys(Chains).includes(network as string) ? Chains[network as ChainsKeys] : null,
    'Unsupported chain passed as url parameter.',
  )

  return <CreateDealForm chainId={chainId} poolAddress={poolAddress as string} />
}

export default genericSuspense(CreateDeal)
