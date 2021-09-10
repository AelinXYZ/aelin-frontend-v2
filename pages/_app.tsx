import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'styled-components'

import 'sanitize.css'
import { theme } from 'theme'
import { GlobalStyle } from 'theme/globalStyle'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>General Site Title</title>
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
export default MyApp
