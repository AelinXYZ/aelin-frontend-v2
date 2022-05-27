import { rgba } from 'polished'

const componentBackgroundColor = '#fff'
const componentBorderColor = 'rgba(71, 87, 97, 0.2)'
const componentBorder = `0.5px solid ${componentBorderColor}`
const lightGray = '#BABCC1'
const error = '#FF7777'
const primary = '#8280FF'
const primaryDarker = '#5F5DD1'
const secondary = '#E56399'
const tertiary = '#A6CFD5'
const textColor = '#666'
const mainBodyBackground = '#fcfcfc'
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

export const lightTheme = {
  pageTitle: {
    color: primaryDarker,
  },
  buttonCircle: {
    borderColor: primary,
  },
  radioButton: {
    borderColor: componentBorderColor,
  },
  checkBox: {
    borderColor: componentBorderColor,
  },
  buttonPrevNext: {
    backgroundColor: '#ccc',
  },
  tooltip: {
    iconBackgroundColor: '#fff',
    iconBorderColor: gray,
    textBackgroundColor: '#fff',
    textBorderColor: componentBorderColor,
    textColor: textColor,
  },
  steps: {
    lineBackgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  infoCell: {
    borderBottomColor: componentBorderColor,
  },
  collapsibleBlock: {
    buttonBackgroundColor: '#fff',
    buttonBorderColor: 'rgba(71, 87, 97, 0.3)',
    buttonColor: 'rgba(71, 87, 97, 0.3)',
  },
  myPool: {
    backgroundColor: '#FCFCFC',
    borderColor: componentBorderColor,
    color: textColor,
  },
  logo: {
    color: primaryDarker,
  },
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
    borderColor: primary,
    borderColorHover: primary,
    color: primary,
    colorHover: primary,
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
    backgroundColor: '#fff',
    backgroundColorHover: '#fff',
    borderColor: componentBorderColor,
    borderColorHover: componentBorderColor,
    color: textColor,
    colorHover: textColor,
  },
  buttonGradient: {
    color: '#fff',
  },
  card: {
    backgroundColor: componentBackgroundColor,
    borderColor: componentBorder,
    titleColor: primaryDarker,
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
    textColorLight: textColor,
    transparentWhite: transparentWhite,
    transparentWhite2: transparentWhite2,
    areaChartGradientStart: primary,
    areaChartGradientEnd: areaChartGradientEnd,
  },
  dropdown: {
    background: '#fff',
    borderColor: componentBorderColor,
    boxShadow: 'none',
    item: {
      backgroundColor: 'transparent',
      backgroundColorActive: 'rgba(0, 0, 0, 0.06)',
      backgroundColorHover: 'rgba(0, 0, 0, 0.06)',
      borderColor: 'transparent',
      color: textColor,
      colorActive: textColor,
    },
  },
  header: {
    lineColor: componentBorderColor,
  },
  headerDropdown: {
    backgroundColor: '#fff',
    borderColor: componentBorderColor,
  },
  networkPlaceholder: {
    backgroundColor: 'rgba(71, 87, 97, 0.7)',
    color: '#fff',
  },
  progressBar: {
    background: 'rgba(71, 87, 97, 0.16)',
  },
  searchDropdown: {
    backgroundColor: '#fff',
  },
  searchDropdownButton: {
    backgroundColor: '#fff',
    color: textColor,
  },
  table: {
    sortBackgroundColor: primaryDarker,
    thColor: primaryDarker,
  },
  toast: {
    backgroundColor: '#fff',
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
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backgroundColorActive: 'rgba(130, 128, 255, 0.2)',
    backgroundColorMain: '#fff',
    backgroundColorMainActive: '#8280ff',
    backgroundColorMiddle: transparentWhite,
    backgroundColorMiddleActive: 'rgba(130, 128, 255, 0.4)',
  },
  textField: {
    backgroundColor: '#fff',
    borderColor: componentBorderColor,
    color: textColor,
    errorColor: error,
    successColor: green,
    active: {
      backgroundColor: '#fff',
      borderColor: primary,
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
      color: textColor,
    },
    placeholder: {
      color: 'rgba(71, 87, 97, 0.5)',
    },
  },
}
