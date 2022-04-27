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
const pink = '#FF50B9'
const gradientStart = '#5452C3'
const gradientEnd = '#01A0D3'
const blueishGray = '#484d58'
const transparentWhite = 'rgba(255, 255, 255, 0.4)'
const transparentWhite2 = 'rgba(255, 255, 255, 0.04)'

export const theme = {
  buttonPrimary: {
    backgroundColor: rgba(primary, 0.08),
    backgroundColorHover: rgba(primary, 0.2),
    borderColor: primary,
    borderColorHover: primary,
    color: primary,
    colorHover: primary,
  },
  buttonPrimaryLight: {
    backgroundColor: 'transparent',
    backgroundColorHover: 'transparent',
    borderColor: '#fff',
    borderColorHover: '#fff',
    color: textColor,
    colorHover: textColor,
  },
  buttonPrimaryLighter: {
    backgroundColor: mainBodyBackground,
    backgroundColorHover: mainBodyBackground,
    borderColor: lightGray,
    borderColorHover: lightGray,
    color: lightGray,
    colorHover: lightGray,
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
    lightGray: lightGray,
    mainBodyBackground: mainBodyBackground,
    pink: pink,
    primary: primary,
    secondary: secondary,
    tertiary: tertiary,
    textColor: textColor,
    textColorLight: lightGray,
    transparentWhite: transparentWhite,
    transparentWhite2: transparentWhite2,
  },
  dropdown: {
    background: componentBackgroundColor,
    borderColor: lightGray,
    borderRadius: '6px',
    boxShadow: 'none',
    item: {
      backgroundColor: 'transparent',
      backgroundColorActive: 'rgba(255, 255, 255, 0.12)',
      backgroundColorHover: 'rgba(255, 255, 255, 0.12)',
      borderColor: 'transparent',
      color: textColor,
      colorActive: textColor,
      height: '36px',
      paddingHorizontal: '20px',
    },
  },
  fonts: {
    defaultSize: '1.4rem',
    fontFamily: `'Hind Madurai', 'Helvetica Neue', 'Arial', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'`,
    fontFamilyTitle: `'Montserrat', 'Helvetica Neue', 'Arial', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'`,
    fontFamilyCode: `'source-code-pro', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'`,
  },
  toast: {
    borderRadius: componentBorderRadius,
    borderStyle: 'solid',
    borderWidth: '0.5px',
    backgroundColor: gray,
    boxShadow: '0px 0px 10px rgba(255, 255, 255, 0.25)',
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
  stages: {
    awaitingdeal: yellow,
    complete: '#fff',
    dealopen: green,
    dealready: blue,
    fundingdeal: yellow,
    open: green,
    poolopen: green,
    vesting: pink,
  },
  states: {
    green: green,
    yellow: yellow,
    blue: blue,
  },
  stepCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2);',
    backgroundColorActive: 'rgba(130, 128, 255, 0.2);',
    backgroundColorMain: '#fff',
    backgroundColorMainActive: '#8280ff',
    backgroundColorMiddle: transparentWhite,
    backgroundColorMiddleActive: 'rgba(130, 128, 255, 0.4);',
  },
  textField: {
    backgroundColor: gray,
    borderColor: lightGray,
    borderRadius: '8px',
    borderStyle: 'solid',
    borderWidth: '0.5px',
    color: textColor,
    errorColor: error,
    fontSize: '1.4rem',
    fontWeight: '400',
    height: '36px',
    paddingHorizontal: '15px',
    active: {
      color: textColor,
      backgroundColor: gray,
      borderColor: primary,
    },
    placeholder: {
      color: lightGray,
      fontSize: '1.4rem',
    },
  },
  themeBreakPoints: {
    desktopWideStart: '1281px',
    tabletPortraitStart: '481px',
    desktopStart: '1025px',
    tabletLandscapeStart: '769px',
  },
}
