import React, { FC, Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'

import { GeneralError } from '@/src/components/generalError'
import isDev from '@/src/utils/isDev'

type Props = {
  children: React.ReactNode
  fallback?: JSX.Element
}

function DefaultFallback(): JSX.Element {
  return <>default loader</>
}

export function SafeSuspense({ children, fallback = <DefaultFallback /> }: Props): JSX.Element {
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

export function genericSuspense<T>(Element: FC<T>, fallback?: FC<T>) {
  return function GenericSuspenseReturnFunction(props: T) {
    return (
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <GeneralError error={error} resetErrorBoundary={resetErrorBoundary} />
        )}
        onError={(error, info) => isDev && console.error(error, info)}
      >
        <Suspense fallback={fallback ? fallback(props) : <DefaultFallback />}>
          <Element {...props} />
        </Suspense>
      </ErrorBoundary>
    )
  }
}
