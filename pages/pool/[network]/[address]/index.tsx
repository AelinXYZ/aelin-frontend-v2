import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { isAddress } from '@ethersproject/address'
import nullthrows from 'nullthrows'
import { ErrorBoundary } from 'react-error-boundary'

import { Loading } from '@/src/components/common/Loading'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import PoolMain from '@/src/components/pools/PoolMain'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { BaseParagraph } from '@/src/components/pureStyledComponents/text/BaseParagraph'
import { BaseTitle } from '@/src/components/pureStyledComponents/text/BaseTitle'
import { Chains, ChainsKeys } from '@/src/constants/chains'

const Card = styled(BaseCard)`
  margin: auto;
  max-width: 100%;
  width: 300px;
`

const Title = styled(BaseTitle)`
  margin-bottom: 20px;
`

const Button = styled(GradientButton)`
  margin: 30px auto 0;
`

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
      fallbackRender={() => (
        <Card>
          <Title>Oh no!</Title>
          <BaseParagraph>
            The pool was not found. If it was created recently it might take a few minutes for it to
            appear.
          </BaseParagraph>
          <Button onClick={() => router.reload()}>Try Again</Button>
        </Card>
      )}
    >
      <PoolMain chainId={chainId} poolAddress={poolAddress.toLowerCase()} />
    </ErrorBoundary>
  )
}

export default genericSuspense(PoolDetailsPage, () => (
  <Loading text="Pool information is syncing" />
))
