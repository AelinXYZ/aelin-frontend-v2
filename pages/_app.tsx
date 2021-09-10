import type { AppProps } from 'next/app'
import Head from 'next/head'
import styled, { ThemeProvider } from 'styled-components'

import 'sanitize.css'
import { theme } from 'theme'
import { GlobalStyle } from 'theme/globalStyle'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import Web3ConnectionProvider from '@/utils/web3Connection'

const MainWrapper = styled.div`
  flex-grow: 1;
`

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>General Site Title</title>
      </Head>
      <ThemeProvider theme={theme}>
        <Web3ConnectionProvider>
          <GlobalStyle />
          <Header />
          <Component {...pageProps} />
          <Footer />
        </Web3ConnectionProvider>
      </ThemeProvider>
    </>
  )
}
export default MyApp
