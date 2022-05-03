import { DEFAULT_DECIMALS } from '../constants/misc'

export default (value: number): string =>
  value !== undefined
    ? Intl.NumberFormat('en', {
        maximumFractionDigits: DEFAULT_DECIMALS,
      }).format(value)
    : ''
