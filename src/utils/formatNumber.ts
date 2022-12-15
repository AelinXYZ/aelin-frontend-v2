import { DISPLAY_DECIMALS, SMALL_NUMBER_DISPLAY_DECIMALS } from '@/src/constants/misc'

export const formatNumber = (value?: number | null, decimals = DISPLAY_DECIMALS): string =>
  value !== undefined && value !== null
    ? Intl.NumberFormat('en', {
        maximumFractionDigits:
          value < 1 && decimals < SMALL_NUMBER_DISPLAY_DECIMALS
            ? SMALL_NUMBER_DISPLAY_DECIMALS
            : decimals,
      }).format(value)
    : ''
