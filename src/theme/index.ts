const error = '#db3a3d'
const primary = '#320E3B'
const secondary = '#E56399'
const tertiary = '#A6CFD5'
const textColor = '#000'

export const theme = {
  buttonPrimary: {
    backgroundColor: '#fff',
    backgroundColorHover: '#fafafa',
    borderColor: '#ccc',
    borderColorHover: '#cacaca',
    color: '#000',
    colorHover: '#000',
  },
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
  dropdown: {
    background: '#fff',
    borderColor: '#ccc',
    borderRadius: '6px',
    boxShadow: '0 0 24px 0 rgba(0, 0, 0, 0.1)',
    item: {
      backgroundColor: 'transparent',
      backgroundColorActive: 'rgba(0, 0, 0, 0.05)',
      backgroundColorHover: 'rgba(0, 0, 0, 0.05)',
      borderColor: '#ccc',
      color: '#000',
      colorActive: '#000',
      height: '38px',
      paddingHorizontal: '12px',
    },
  },
  fonts: {
    defaultSize: '1.4rem',
    fontFamily: `'Hind Madurai', 'Helvetica Neue', 'Arial', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'`,
    fontFamilyTitle: `'Montserrat', 'Helvetica Neue', 'Arial', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'`,
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
