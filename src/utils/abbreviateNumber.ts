export const abbreviateNumber = (value: number, maximumFractionDigits = 1): string => {
  return Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: maximumFractionDigits,
  }).format(value)
}
