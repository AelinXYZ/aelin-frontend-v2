import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import { SWRConfig } from 'swr'

import 'sanitize.css'
import { SafeSuspense } from '@/src/components/helpers/SafeSuspense'
import { Header } from '@/src/components/layout/Header'
import { MobileMenu } from '@/src/components/navigation/MobileMenu'
import Toast from '@/src/components/toast/Toast'
import TooltipConfig from '@/src/components/tooltip/TooltipConfig'
import LayoutStatusProvider from '@/src/providers/layoutStatusProvider'
import StakingRewardsProvider from '@/src/providers/stakingRewardsProvider'
import Theme from '@/src/providers/themeSwitchProvider'
import TransactionModalProvider from '@/src/providers/transactionModalProvider'
import Web3ConnectionProvider from '@/src/providers/web3ConnectionProvider'
import { GlobalStyle } from '@/src/theme/globalStyle'

// Should be rendered on client side only!
const TokenIconsProvider = dynamic(() => import('@/src/providers/tokenIconsProvider'), {
  ssr: false,
})

const NotificationsProvider = dynamic(() => import('@/src/providers/notificationsProvider'), {
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
      <Web3ConnectionProvider>
        <LayoutStatusProvider>
          <Theme>
            <SWRConfig
              value={{
                suspense: true,
                revalidateOnFocus: false,
              }}
            >
              <StakingRewardsProvider>
                <TransactionModalProvider>
                  <NotificationsProvider>
                    <GlobalStyle />
                    <SafeSuspense>
                      <TokenIconsProvider>
                        <Header />
                        <Component {...pageProps} />
                        <Toast />
                      </TokenIconsProvider>
                    </SafeSuspense>
                    <TooltipConfig />
                    <MobileMenu />
                  </NotificationsProvider>
                </TransactionModalProvider>
              </StakingRewardsProvider>
            </SWRConfig>
          </Theme>
        </LayoutStatusProvider>
      </Web3ConnectionProvider>
    </>
  )
}
export default App
