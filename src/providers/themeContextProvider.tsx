import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeProvider } from 'styled-components'

import useLocalStorage from '@/src/hooks/localStorage/useLocalStorage'
import { commonTheme } from '@/src/theme/commonTheme'
import { darkTheme } from '@/src/theme/darkTheme'
import { GlobalStyle } from '@/src/theme/globalStyle'
import { lightTheme } from '@/src/theme/lightTheme'

export enum ThemeType {
  light = 'light',
  dark = 'dark',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ThemeContext = createContext({} as any)

const ThemeContextProvider: React.FC = ({ children }) => {
  const [persistentState, setPersistentState] = useLocalStorage(
    `persistent-state_theme`,
    ThemeType.light,
  )
  const [currentThemeName, setCurrentThemeName] = useState(
    persistentState ? persistentState : ThemeType.light,
  )
  const isLightTheme = useMemo(() => currentThemeName === ThemeType.light, [currentThemeName])
  const [currentThemeJSON, setCurrentThemeJSON] = useState(
    isLightTheme ? { ...commonTheme, ...lightTheme } : { ...commonTheme, ...darkTheme },
  )

  const switchTheme = useCallback(() => {
    setCurrentThemeName(isLightTheme ? ThemeType.dark : ThemeType.light)
  }, [isLightTheme])

  useEffect(() => {
    setPersistentState(currentThemeName)
    setCurrentThemeJSON(
      isLightTheme ? { ...commonTheme, ...lightTheme } : { ...commonTheme, ...darkTheme },
    )
  }, [currentThemeName, isLightTheme, setPersistentState])

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
