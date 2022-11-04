import { DISPLAY_DECIMALS } from '@/src/constants/misc'

export const formatNumber = (value?: number | null, decimals = DISPLAY_DECIMALS): string =>
  value !== undefined && value !== null
    ? Intl.NumberFormat('en', {
        maximumFractionDigits: decimals,
      }).format(value)
    : ''
