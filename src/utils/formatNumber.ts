import { DEFAULT_DECIMALS } from '../constants/misc'

export const formatNumber = (value: number, decimals = DEFAULT_DECIMALS): string =>
  value !== undefined
    ? Intl.NumberFormat('en', {
        maximumFractionDigits: decimals,
      }).format(value)
    : ''
