import { createGlobalStyle } from 'styled-components'

import { theme } from '@/src/theme/index'
import { onBoardCSS } from '@/src/theme/onBoard'

type ThemeType = typeof theme

export const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
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
    line-height: 1.2;
    min-height: 100vh;
    outline-color: ${({ theme }) => theme.colors.secondary};
    width: 100%;

    @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
      background-image: url('/resources/svg/bg-main.svg');
      background-repeat: repeat;
    }
  }

  a {
    color: ${({ theme }) => theme.colors.textColor};
  }

  code {
    font-family: ${({ theme }) => theme.fonts.fontFamilyCode};
  }

  #__next {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: ${({ theme }) => theme.layout.paddingMobile};

    @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
      padding: ${({ theme }) => theme.layout.paddingTabletLandscapeStart};
    }

    @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
      padding: ${({ theme }) => theme.layout.paddingDesktopStart};
    }

    @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopWideStart}) {
      padding: ${({ theme }) => theme.layout.paddingDesktopWideStart};
    }
  }

  .__react_component_tooltip.show.customTooltip {
    color: ${({ theme }) => theme.colors.textColor};
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.25);
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 1.5;
    max-width: 280px;
    opacity: 1;
    overflow-wrap: break-word;
    padding: 7px 10px 6px;
    text-align: left;
    text-transform: none;
    white-space: normal;
    word-wrap: break-word;

    &::before,
    &::after {
      display: none !important;
    }

    p {
      margin: 0 0 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    > a {
      color: ${({ theme }) => theme.colors.textColor};
      text-decoration: underline;
    }

    > a:hover {
      color: ${({ theme }) => theme.colors.textColor};
    }
  }

  ${onBoardCSS}
`
