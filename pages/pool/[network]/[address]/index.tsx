import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { isAddress } from '@ethersproject/address'
import nullthrows from 'nullthrows'
import { ErrorBoundary } from 'react-error-boundary'

import { Loading } from '@/src/components/common/Loading'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import PoolMain from '@/src/components/pools/PoolMain'
import { Button } from '@/src/components/pureStyledComponents/buttons/Button'
import { Chains, ChainsKeys } from '@/src/constants/chains'

const PoolDetailsPage: NextPage = () => {
  const router = useRouter()
  const { address: poolAddress, network } = router.query

  if (!poolAddress || !network || Array.isArray(poolAddress)) {
    return null
  }

  const chainId = nullthrows(
    Object.keys(Chains).includes(network as string) ? Chains[network as ChainsKeys] : null,
    'Unsupported chain passed as url parameter.',
  )

  if (!isAddress(poolAddress.toLowerCase())) {
    throw Error('Pool address is not a valid address.')
  }

  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <>
          <p>Oh no!</p>
          <p>
            The pool was not found, if it was created recently it might take some minutes to appear
          </p>
          <Button onClick={resetErrorBoundary}>Try Again</Button>
        </>
      )}
    >
      <PoolMain chainId={chainId} poolAddress={poolAddress.toLowerCase()} />
    </ErrorBoundary>
  )
}

export default genericSuspense(PoolDetailsPage, () => (
  <Loading text="Pool information is syncing" />
))
