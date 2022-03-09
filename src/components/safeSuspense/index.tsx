import React, { Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'

import { GeneralError } from '@/src/components/generalError'
import isDev from '@/src/utils/isDev'

type Props = {
  children: React.ReactNode
  fallback?: JSX.Element
}

function DefaultFallback(): JSX.Element {
  return <></>
}

export default function SafeSuspense({
  children,
  fallback = <DefaultFallback />,
}: Props): JSX.Element {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <GeneralError error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
      onError={(error, info) => isDev && console.error(error, info)}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}
