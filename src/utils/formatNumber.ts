import { DEFAULT_DECIMALS } from '../constants/misc'

export default (value: number, decimals = DEFAULT_DECIMALS): string =>
  value !== undefined
    ? Intl.NumberFormat('en', {
        maximumFractionDigits: decimals,
      }).format(value)
    : ''
