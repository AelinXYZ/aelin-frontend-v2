import { useRouter } from 'next/router'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ThemeProvider } from 'styled-components'

import { ETHLIZARDS_VOUCHER_ENS, ZERO_ADDRESS } from '@/src/constants/misc'
import { ThemeType } from '@/src/constants/types'
import useIsPoolVouchedByAddress from '@/src/hooks/aelin/vouched-pools/useIsPoolVouchedByAddress'
import useLocalStorage from '@/src/hooks/localStorage/useLocalStorage'
import { commonTheme } from '@/src/theme/commonTheme'
import { darkTheme } from '@/src/theme/darkTheme'
import { ethlizardsTheme } from '@/src/theme/ethlizardsTheme'
import { GlobalStyle } from '@/src/theme/globalStyle'
import { lightTheme } from '@/src/theme/lightTheme'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ThemeContext = createContext({} as any)

const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  const { address: poolAddress, voucher } = router.query

  const [persistentState, setPersistentState] = useLocalStorage(
    `persistent-state_theme`,
    ThemeType.dark,
  )
  const [currentThemeName, setCurrentThemeName] = useState(
    persistentState ? persistentState : ThemeType.dark,
  )
  const isLightTheme = useMemo(() => currentThemeName === ThemeType.light, [currentThemeName])

  const [currentThemeJSON, setCurrentThemeJSON] = useState(
    isLightTheme ? { ...commonTheme, ...lightTheme } : { ...commonTheme, ...darkTheme },
  )

  const { isVouched } = useIsPoolVouchedByAddress((poolAddress ?? ZERO_ADDRESS) as string)

  const switchTheme = useCallback(() => {
    setCurrentThemeName(isLightTheme ? ThemeType.dark : ThemeType.light)
  }, [isLightTheme])

  useEffect(() => {
    const isOnHomePage = router.pathname === '/'
    const isOnPoolPage = router.pathname === '/pool/[network]/[address]' && isVouched

    const isEthlizardsVoucher = [
      ETHLIZARDS_VOUCHER_ENS,
      ETHLIZARDS_VOUCHER_ENS.slice(0, ETHLIZARDS_VOUCHER_ENS.lastIndexOf('.')),
    ].some((ens) => ens === voucher)

    if (isEthlizardsVoucher && (isOnHomePage || isOnPoolPage)) {
      setPersistentState(ThemeType.ethlizards)
      setCurrentThemeName(ThemeType.ethlizards)
      setCurrentThemeJSON({ ...commonTheme, ...ethlizardsTheme })
      return
    }

    setPersistentState(currentThemeName)
    setCurrentThemeJSON({
      ...commonTheme,
      ...(isLightTheme ? lightTheme : darkTheme),
    })
  }, [currentThemeName, isLightTheme, setPersistentState, voucher, isVouched, router.pathname])

  const values = {
    switchTheme,
    currentThemeName,
  }

  return (
    <ThemeContext.Provider value={values}>
      <ThemeProvider theme={currentThemeJSON}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeContextProvider

export function useThemeContext() {
  return useContext(ThemeContext)
}
