import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { ThemeProvider } from 'styled-components'

import { SWRConfig } from 'swr'

import 'sanitize.css'
import { SafeSuspense } from '@/src/components/helpers/safeSuspense'
import { Header } from '@/src/components/layout/Header'
import Web3ConnectionProvider from '@/src/providers/web3ConnectionProvider'
import { theme } from '@/src/theme'
import { GlobalStyle } from '@/src/theme/globalStyle'

// Should be rendered on client side only!
const GeneralContextProvider = dynamic(() => import('@/src/providers/generalProvider'), {
  ssr: false,
})

function App({ Component, pageProps }: AppProps) {
  const { hostname, port, protocol } =
    typeof window !== 'undefined'
      ? window.location
      : { hostname: 'localhost', port: 3000, protocol: 'http:' }
  const portString = port ? `:${port}` : ''
  const siteURL = typeof window !== 'undefined' ? `${protocol}//${hostname}${portString}` : ''
  const title = 'Aelin'
  const description = 'Aelin'
  const twitterHandle = '@'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content="summary_large_image" name="twitter:card" />
        <meta content="website" property="og:type" />
        <meta content={`${siteURL}/shareable/ogImage.jpg`} property="og:image" />
        <meta content={description} name="description" />
        <meta content={description} property="og:description" />
        <meta content={siteURL} property="og:url" />
        <meta content={title} name="twitter:site" />
        <meta content={title} property="og:title" />
        <meta content={twitterHandle} name="twitter:creator" />
      </Head>
      <ThemeProvider theme={theme}>
        <SWRConfig
          value={{
            suspense: true,
            revalidateOnFocus: false,
          }}
        >
          <Web3ConnectionProvider>
            <GeneralContextProvider>
              <GlobalStyle />
              <Header />
              <SafeSuspense>
                <Component {...pageProps} />
              </SafeSuspense>
            </GeneralContextProvider>
          </Web3ConnectionProvider>
        </SWRConfig>
      </ThemeProvider>
    </>
  )
}
export default App
