import { css } from 'styled-components'

export const ContainerPadding = css`
  padding-left: ${({ theme }) => theme.layout.horizontalPaddingMobile};
  padding-right: ${({ theme }) => theme.layout.horizontalPaddingMobile};

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    padding-left: ${({ theme }) => theme.layout.horizontalPaddingTabletPortraitStart};
    padding-right: ${({ theme }) => theme.layout.horizontalPaddingTabletPortraitStart};
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    padding-left: ${({ theme }) => theme.layout.horizontalPaddingTabletLandscapeStart};
    padding-right: ${({ theme }) => theme.layout.horizontalPaddingTabletLandscapeStart};
  }
`
