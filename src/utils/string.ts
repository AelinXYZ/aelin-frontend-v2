export const truncateStringInTheMiddle = (
  str: string,
  strPositionStart: number,
  strPositionEnd: number,
) => {
  const minTruncatedLength = strPositionStart + strPositionEnd
  if (minTruncatedLength < str.length) {
    return `${str.substr(0, strPositionStart)}...${str.substr(
      str.length - strPositionEnd,
      str.length,
    )}`
  }
  return str
}

export const shortenAddress = (
  address: string | undefined,
  first = 6,
  last = 4,
): string | undefined => {
  return address
    ? [String(address).slice(0, first), String(address).slice(-last)].join('...')
    : undefined
}
