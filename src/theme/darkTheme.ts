import { lighten, rgba } from 'polished'

const componentBackgroundColor = '#1A212F'
const componentBorderColor = '#555C65'
const componentBorder = `0.5px solid ${componentBorderColor}`
const lightGray = '#BABCC1'
const error = '#FF7777'
const primary = '#8280FF'
const secondary = '#E56399'
const tertiary = '#A6CFD5'
const textColor = '#FFF'
const mainBodyBackground = '#101826'
const green = '#A2FF00'
const yellow = '#F1C40F'
const blue = '#469FFF'
const gray = '#282E3B'
const pink = '#FF50B9'
const gradientStart = '#5452C3'
const gradientEnd = '#01A0D3'
const blueishGray = '#484D58'
const transparentWhite = 'rgba(255, 255, 255, 0.4)'
const transparentWhite2 = 'rgba(255, 255, 255, 0.04)'
const areaChartGradientEnd = '#232A37'

export const darkTheme = {
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
    areaChartGradientStart: primary,
    areaChartGradientEnd: areaChartGradientEnd,
  },
  dropdown: {
    background: componentBackgroundColor,
    borderColor: lightGray,
    boxShadow: 'none',
    item: {
      backgroundColor: 'transparent',
      backgroundColorActive: 'rgba(255, 255, 255, 0.12)',
      backgroundColorHover: 'rgba(255, 255, 255, 0.12)',
      borderColor: 'transparent',
      color: textColor,
      colorActive: textColor,
    },
  },
  toast: {
    backgroundColor: gray,
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.25)',
  },
  stages: {
    open: green,
    awaitingdeal: yellow,
    dealopen: green,
    dealready: blue,
    vesting: pink,
    complete: '#fff',
    fundingdeal: yellow,
    poolopen: green,
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
    color: textColor,
    errorColor: error,
    successColor: green,
    active: {
      color: textColor,
      backgroundColor: gray,
      borderColor: primary,
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
    },
    placeholder: {
      color: lightGray,
    },
  },
}
