import { createGlobalStyle } from 'styled-components'

import { theme } from '@/src/theme/index'

type ThemeType = typeof theme

export const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
  :root {}

  html {
    font-size: 10px;
    scroll-behavior: smooth;
  }

  body {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    background-color: ${({ theme }) => theme.colors.mainBodyBackground};
    color: ${({ theme }) => theme.colors.textColor};
    font-family: ${({ theme }) => theme.fonts.fontFamily};
    font-size: ${({ theme }) => theme.fonts.defaultSize};
    min-height: 100vh;
    outline-color: ${({ theme }) => theme.colors.secondary};
  }

  code {
    font-family: ${({ theme }) => theme.fonts.fontFamilyCode};
  }

  #__next {
    display: flex;
    flex-direction: column;
    padding: ${({ theme }) => theme.layout.paddingMobile};

    @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
      padding: ${({ theme }) => theme.layout.paddingDesktopStart};
    }

    @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopWideStart}) {
      padding: ${({ theme }) => theme.layout.paddingDesktopWideStart};
    }
  }
`
