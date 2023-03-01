import { lighten, rgba } from 'polished'

const componentBackgroundColor = 'rgba(255, 255, 255, 0.05)'
const componentBorderColor = '#93DD7D'
const componentBorderColorSecondary = '#93DD7D'
const componentBorder = `0.5px solid ${componentBorderColor}`
const lightGray = '#BABCC1'
const error = '#FF7777'
const primary = '#93DD7D'
const secondary = '#5452C3'
const tertiary = '#E56399'
const textColor = '#FFF'
const mainBodyBackground = '#000c0e'
const green = '#A2FF00'
const yellow = '#F1C40F'
const blue = '#469FFF'
const gray = '#282E3B'
const pink = '#FF50B9'
const primaryGradientStart = '#93DD7D'
const primaryGradientEnd = '#558CCE'
const secondaryGradientStart = '#93DD7D'
const secondaryGradientEnd = '#558CCE'
const blueishGray = '#484D58'
const transparentWhite = 'rgba(255, 255, 255, 0.4)'
const transparentWhite2 = 'rgba(255, 255, 255, 0.04)'
const areaChartGradientEnd = '#232A37'

export const ethlizardsTheme = {
  ethliz: {},
  modal: {
    overlayBackgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  mobileMenu: {
    backgroundColor: gray,
    itemColor: lightGray,
  },
  pageTitle: {
    color: textColor,
  },
  buttonCircle: {
    borderColor: '#fff',
  },
  radioButton: {
    borderColor: '#fff',
  },
  checkBox: {
    borderColor: '#fff',
  },
  buttonPrevNext: {
    backgroundColor: gray,
  },
  tooltip: {
    iconBackgroundColor: gray,
    iconBorderColor: '#fff',
    textBackgroundColor: gray,
    textBorderColor: '#fff',
    textColor: '#fff',
  },
  steps: {
    lineBackgroundColor: 'rgba(255, 255, 255, 0.2)',
    textIsActiveColor: primary,
    textIsDoneColor: textColor,
    textColor: 'rgba(255, 255, 255, 0.4)',
  },
  infoCell: {
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  collapsibleBlock: {
    buttonBackgroundColor: 'rgba(255, 255, 255, 0.06)',
    buttonBorderColor: 'rgba(255, 255, 255, 0.06)',
    buttonColor: '#fff',
  },
  myPool: {
    backgroundColor: gray,
    borderColor: gray,
    color: textColor,
  },
  logo: {
    color: primary,
  },
  buttonPrimary: {
    backgroundColor: rgba(primary, 0.08),
    backgroundColorHover: rgba(primary, 0.2),
    borderColor: primary,
    borderColorHover: primary,
    color: primary,
    colorHover: primary,
  },
  buttonSecondary: {
    backgroundColor: rgba(secondary, 0.08),
    backgroundColorHover: rgba(secondary, 0.2),
    borderColor: secondary,
    borderColorHover: secondary,
    color: secondary,
    colorHover: secondary,
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
  buttonGradient: {
    color: textColor,
  },
  card: {
    backgroundColor: componentBackgroundColor,
    borderColor: componentBorder,
    titleColor: textColor,
    backdropFilter: 'blur(5px)',
  },
  colors: {
    blueishGray: blueishGray,
    borderColor: componentBorderColor,
    borderColorSecondary: componentBorderColorSecondary,
    componentBackgroundColor: componentBackgroundColor,
    error: error,
    gradientEnd: primaryGradientEnd,
    gradientStart: primaryGradientStart,
    secondaryGradientStart: secondaryGradientStart,
    secondaryGradientEnd: secondaryGradientEnd,
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
  header: {
    lineColor: 'rgba(255, 255, 255, 0.25)',
  },
  headerDropdown: {
    backgroundColor: gray,
    borderColor: lightGray,
  },
  networkPlaceholder: {
    backgroundColor: '#fff',
    color: mainBodyBackground,
  },
  progressBar: {
    background: blueishGray,
  },
  searchDropdown: {
    backgroundColor: gray,
  },
  searchDropdownButton: {
    backgroundColor: gray,
    color: textColor,
  },
  table: {
    sortBackgroundColor: '#fff',
    thColor: textColor,
  },
  toast: {
    backgroundColor: gray,
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.25)',
  },
  nftWhiteList: {
    border: 'rgba(255, 255, 255, 0.25)',
    borderRadius: '8px',
    layerBackgroundColor: 'rgba(255, 255, 255, 0.04)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColorActive: 'rgba(147, 221, 125, 0.2);',
    backgroundColorMain: '#fff',
    backgroundColorMainActive: '#93DD7D',
    backgroundColorMiddle: transparentWhite,
    backgroundColorMiddleActive: 'rgba(147, 221, 125, 0.4);',
  },
  textField: {
    backgroundColor: gray,
    borderColor: lightGray,
    color: textColor,
    errorColor: error,
    successColor: green,
    active: {
      backgroundColor: gray,
      borderColor: primary,
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
      color: textColor,
    },
    placeholder: {
      color: lightGray,
    },
  },
}
