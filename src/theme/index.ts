import { lighten, rgba } from 'polished'

const componentBackgroundColor = '#1A212F'
const componentBorderColor = '#555C65'
const componentBorder = `0.5px solid ${componentBorderColor}`
const componentBorderRadius = '8px'
const lightGray = '#BABCC1'
const error = '#db3a3d'
const primary = '#8280FF'
const secondary = '#E56399'
const tertiary = '#A6CFD5'
const textColor = '#fff'
const mainBodyBackground = '#101826'
const green = '#A2FF00'
const yellow = '#F1C40F'
const blue = '#469FFF'
const gray = '#282E3B'
const gradientStart = '#5452C3'
const gradientEnd = '#01A0D3'
const blueishGray = '#484d58'

export const theme = {
  buttonPrimary: {
    backgroundColor: rgba(primary, 0.08),
    backgroundColorHover: rgba(primary, 0.2),
    borderColor: primary,
    borderColorHover: primary,
    color: primary,
    colorHover: primary,
  },
  buttonDropdown: {
    backgroundColor: componentBackgroundColor,
    backgroundColorHover: lighten(0.1, componentBackgroundColor),
    borderColor: lightGray,
    borderColorHover: lightGray,
    color: textColor,
    colorHover: textColor,
  },
  card: {
    backgroundColor: componentBackgroundColor,
    borderColor: componentBorder,
    borderRadius: componentBorderRadius,
  },
  colors: {
    blueishGray: blueishGray,
    borderColor: componentBorderColor,
    componentBackgroundColor: componentBackgroundColor,
    error: error,
    gradientEnd: gradientEnd,
    gradientStart: gradientStart,
    gray: gray,
    mainBodyBackground: mainBodyBackground,
    primary: primary,
    secondary: secondary,
    tertiary: tertiary,
    textColor: textColor,
    textColorLight: lightGray,
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
  states: {
    green: green,
    yellow: yellow,
    blue: blue,
  },
  textField: {
    backgroundColor: componentBackgroundColor,
    borderColor: lightGray,
    borderRadius: '25px',
    borderStyle: 'solid',
    borderWidth: '1px',
    color: textColor,
    errorColor: error,
    fontSize: '1.4rem',
    fontWeight: '400',
    height: '36px',
    paddingHorizontal: '15px',
    active: {
      color: textColor,
      backgroundColor: componentBackgroundColor,
      borderColor: lightGray,
    },
    placeholder: {
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },
  themeBreakPoints: {
    desktopWideStart: '1281px',
    tabletPortraitStart: '481px',
    desktopStart: '1025px',
    tabletLandscapeStart: '769px',
  },
}
