import BigNumber from 'bignumber.js'

export function getHumanValue(value: number | BigNumber, decimals?: number): BigNumber
export function getHumanValue(value?: BigNumber.Value, decimals?: number): BigNumber | undefined {
  return value ? BigNumber.from(value)?.unscaleBy(decimals) : undefined
}

export function getNonHumanValue(value: number | BigNumber, decimals?: number): BigNumber
export function getNonHumanValue(
  value?: BigNumber.Value,
  decimals?: number,
): BigNumber | undefined {
  return value ? BigNumber.from(value)?.scaleBy(decimals) : undefined
}

export function formatBigValue(
  value?: BigNumber | number,
  decimals = 4,
  defaultValue = '-',
  minDecimals: number | undefined = undefined,
): string {
  if (value === undefined) {
    return defaultValue
  }

  const bnValue = new BigNumber(value)

  if (bnValue.isNaN()) {
    return defaultValue
  }

  return new BigNumber(bnValue.toFixed(decimals)).toFormat(minDecimals)
}

type FormatNumberOptions = {
  decimals?: number
}

export function formatNumber(
  value: number | BigNumber | undefined,
  options?: FormatNumberOptions,
): string | undefined {
  if (value === undefined || Number.isNaN(value)) {
    return undefined
  }

  const { decimals } = options ?? {}

  const val = BigNumber.isBigNumber(value) ? value.toNumber() : value

  return Intl.NumberFormat('en', {
    maximumFractionDigits: decimals,
  }).format(val)
}

export function formatPercent(
  value: number | BigNumber | undefined,
  decimals = 2,
): string | undefined {
  if (value === undefined || Number.isNaN(value)) {
    return undefined
  }

  const rate = BigNumber.isBigNumber(value) ? value.toNumber() : value

  return (
    Intl.NumberFormat('en', {
      maximumFractionDigits: decimals,
    }).format(rate * 100) + '%'
  )
}

type FormatTokenOptions = {
  tokenName?: string
  decimals?: number
  minDecimals?: number
  maxDecimals?: number
  scale?: number
  compact?: boolean
}

export function formatToken(
  value: number | BigNumber | undefined,
  options?: FormatTokenOptions,
): string | undefined {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return undefined
  }

  let val = new BigNumber(value)

  if (val.isNaN()) {
    return undefined
  }

  if (options) {
    // eslint-disable-next-line no-prototype-builtins
    if (options.hasOwnProperty('scale') && options.scale === undefined) {
      return undefined
    }
  }

  const { compact = false, decimals = 4, minDecimals, scale = 0, tokenName } = options ?? {}

  if (scale > 0) {
    val = val.unscaleBy(scale)!
  }

  let str = ''

  if (compact) {
    str = Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(val.toNumber())
  } else {
    str = new BigNumber(val.toFixed(decimals)).toFormat(minDecimals)
  }

  return tokenName ? `${str} ${tokenName}` : str
}

type FormatUSDOptions = {
  decimals?: number
  compact?: boolean
}

export function formatUSD(
  value: number | BigNumber | string | undefined,
  options?: FormatUSDOptions,
): string | undefined {
  let val = value

  if (val === undefined || val === null) {
    return undefined
  }

  if (typeof val === 'string') {
    val = Number(val)
  }

  if (BigNumber.isBigNumber(val)) {
    if (val.isNaN()) {
      return undefined
    }
  } else if (typeof val === 'number') {
    if (!Number.isFinite(val)) {
      return undefined
    }
  }

  const { compact = false, decimals = 2 } = options ?? {}

  if (0 > decimals || decimals > 20) {
    console.trace(`Decimals value is out of range 0..20 (value: ${decimals})`)
    return undefined
  }

  let str = ''

  if (compact) {
    str = Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: decimals !== 0 ? decimals : undefined,
    }).format(BigNumber.isBigNumber(val) ? val.toNumber() : val)
  } else {
    str = new BigNumber(val.toFixed(decimals)).toFormat(decimals)
  }

  return `$${str}`
}

export function formatUSDValue(
  value?: BigNumber | number,
  decimals = 2,
  minDecimals: number = decimals,
): string {
  if (value === undefined) {
    return '-'
  }

  const val = BigNumber.isBigNumber(value) ? value : new BigNumber(value)
  const formattedValue = formatBigValue(val.abs(), decimals, '-', minDecimals)

  return val.isPositive() ? `$${formattedValue}` : `-$${formattedValue}`
}

export function shortenAddr(addr: string | undefined, first = 6, last = 4): string | undefined {
  return addr ? [String(addr).slice(0, first), String(addr).slice(-last)].join('...') : undefined
}
