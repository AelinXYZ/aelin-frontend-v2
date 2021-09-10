import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'styled-components'

import 'sanitize.css'
import { theme } from 'theme'
import { GlobalStyle } from 'theme/globalStyle'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>General Site Title</title>
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Header />
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </>
  )
}
export default MyApp
