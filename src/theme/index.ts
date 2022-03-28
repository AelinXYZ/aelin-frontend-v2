import { rgba } from 'polished'

const componentBackgroundColor = '#1B1C20'
const componentBorderColor = 'rgba(255, 255, 255, 0.25)'
const componentBorder = `0.5px solid ${componentBorderColor}`
const componentBorderRadius = '8px'
const error = '#db3a3d'
const primary = '#8280FF'
const secondary = '#E56399'
const tertiary = '#A6CFD5'
const textColor = '#fff'
const textColorLight = '#BABCC1'
const mainBodyBackground = '#111317'

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
    mainBodyBackground: mainBodyBackground,
    primary: primary,
    secondary: secondary,
    tertiary: tertiary,
    textColor: textColor,
    textColorLight: textColorLight,
  },
  dropdown: {
    background: mainBodyBackground,
    borderColor: componentBorderColor,
    borderRadius: '6px',
    boxShadow: 'none',
    item: {
      backgroundColor: 'transparent',
      backgroundColorActive: rgba(primary, 0.08),
      backgroundColorHover: rgba(primary, 0.08),
      borderColor: componentBorderColor,
      color: '#fff',
      colorActive: primary,
      height: '36px',
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
  header: {
    height: '60px',
  },
  layout: {
    maxWidth: '1360px',
    paddingDesktopStart: '20px',
    paddingDesktopWideStart: '20px 40px',
    paddingMobile: '0 10px 10px 10px',
  },
  themeBreakPoints: {
    desktopWideStart: '1281px',
    tabletPortraitStart: '481px',
    desktopStart: '1025px',
    tabletLandscapeStart: '769px',
  },
}
