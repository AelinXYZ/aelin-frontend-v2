import { rgba } from 'polished'

const componentBackgroundColor = 'rgba(255, 255, 255, 0.04)'
const componentBorder = '0.5px solid rgba(255, 255, 255, 0.25)'
const componentBorderRadius = '8px'
const error = '#db3a3d'
const primary = '#3CBFF0'
const secondary = '#E56399'
const tertiary = '#A6CFD5'
const textColor = '#fff'

export const theme = {
  buttonPrimary: {
    backgroundColor: rgba(primary, 0.08),
    backgroundColorHover: rgba(primary, 0.2),
    borderColor: primary,
    borderColorHover: primary,
    color: primary,
    colorHover: primary,
  },
  card: {
    backgroundColor: componentBackgroundColor,
    borderColor: componentBorder,
    borderRadius: componentBorderRadius,
  },
  colors: {
    componentBackgroundColor: componentBackgroundColor,
    error: error,
    mainBodyBackground: '#101826',
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
  header: { height: '60px' },
  layout: {
    maxWidth: '1360px',
    paddingDesktopStart: '20px',
    paddingDesktopWideStart: '20px 40px',
    paddingMobile: '10px',
  },
  themeBreakPoints: {
    desktopWideStart: '1281px',
    tabletPortraitStart: '481px',
    desktopStart: '1025px',
    tabletLandscapeStart: '769px',
  },
}
