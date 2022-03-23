import { BigNumber } from '@ethersproject/bignumber'
import { intervalToDuration, isAfter } from 'date-fns'
import formatFNS from 'date-fns/format'

export const DATE_FORMAT_SIMPLE = 'yyyy-MM-dd'
export const DATE_DETAILED = 'MMM dd, yyyy hh:mm a'

export function formatDate(date: Date, format: string): string {
  return formatFNS(date, format)
}

export function secondsToDhm(seconds = 0) {
  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  // ßconst s = Math.floor(seconds % 60)

  const dDisplay = d > 0 ? d + (d == 1 ? ' day ' : ' days ') : ''
  const hDisplay = h > 0 ? h + (h == 1 ? ' hour ' : ' hours ') : ''
  const mDisplay = m > 0 ? m + (m == 1 ? ' minute ' : ' minutes ') : ''
  //const sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : ''

  return dDisplay + hDisplay + mDisplay
}

export default function getDailyValueFromValuePerSecond(vps: BigNumber): BigNumber {
  return vps.mul(60).mul(60).mul(24)
}

export const getFormattedDurationFromDateToNow = (date: Date | number, message: string) => {
  if (isAfter(new Date(date), new Date())) {
    const duration = intervalToDuration({
      start: new Date(date),
      end: new Date(),
    })

    return `~${duration.days}d ${duration.hours}h ${duration.minutes}m`
  }
  return message
}
