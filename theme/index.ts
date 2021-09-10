const error = '#db3a3d'
const primary = '#320E3B'
const secondary = '#E56399'
const tertiary = '#A6CFD5'
const textColor = '#000'

export const theme = {
  card: {
    backgroundColor: '#fff',
    backgroundOpacity: '1',
    borderRadius: '12px',
  },
  colors: {
    error: error,
    mainBodyBackground: '#fff',
    primary: primary,
    secondary: secondary,
    tertiary: tertiary,
    textColor: textColor,
  },
  fonts: {
    defaultSize: '1.4rem',
    fontFamily: `'Roboto', 'Helvetica Neue', 'Arial', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'`,
    fontFamilyCode: `'source-code-pro', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'`,
  },
  footer: {},
  header: { height: '65px' },
  layout: {
    horizontalPaddingMobile: '10px',
    horizontalPaddingTabletPortraitStart: '80px',
    horizontalPaddingTabletLandscapeStart: '15px',
    maxWidth: '1122px',
  },
  themeBreakPoints: {
    desktopWideStart: '1281px',
    tabletPortraitStart: '481px',
    desktopStart: '1025px',
    tabletLandscapeStart: '769px',
  },
}
