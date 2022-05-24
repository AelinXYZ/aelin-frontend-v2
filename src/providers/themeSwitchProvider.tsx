import { createContext, useContext, useState } from 'react'
import { ThemeProvider } from 'styled-components'

import { commonTheme } from '@/src/theme/commonTheme'
import { darkTheme } from '@/src/theme/darkTheme'
import { lightTheme } from '@/src/theme/lightTheme'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ThemeContext = createContext({} as any)

const ThemeContextProvider: React.FC = ({ children }) => {
  const [currentThemeName, setCurrentThemeName] = useState('light')
  const [currentTheme, setCurrentTheme] = useState({ ...commonTheme, ...lightTheme })

  const switchTheme = () => {
    setCurrentThemeName(currentThemeName === 'light' ? 'dark' : 'light')
    setCurrentTheme(
      currentThemeName === 'light'
        ? { ...commonTheme, ...darkTheme }
        : { ...commonTheme, ...lightTheme },
    )
  }

  const values = {
    switchTheme,
    currentThemeName,
  }

  return (
    <ThemeContext.Provider value={values}>
      <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeContextProvider

export function useThemeContext() {
  return useContext(ThemeContext)
}
