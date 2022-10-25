import { BigNumber } from '@ethersproject/bignumber'
import { Duration } from 'date-fns'
import add from 'date-fns/add'
import format from 'date-fns/format'
import formatFNS from 'date-fns/format'
import intervalToDuration from 'date-fns/intervalToDuration'
import isAfter from 'date-fns/isAfter'

import { ONE_DAY_IN_SECS, ONE_HOUR_IN_SECS, ONE_MINUTE_IN_SECS } from '@/src/constants/time'

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

export const getFormattedDurationFromDateToNow = (date: Date | number | null) => {
  if (date && isAfter(new Date(date), new Date())) {
    const duration = intervalToDuration({
      start: new Date(date),
      end: new Date(),
    })

    return duration.months
      ? `~${duration.months}m ${duration.days}d ${duration.hours}h`
      : `~${duration.days}d ${duration.hours}h ${duration.minutes}m`
  }

  return ''
}

export const convertToSeconds = ({
  days,
  hours,
  minutes,
}: {
  days: number
  hours: number
  minutes: number
}) => days * ONE_DAY_IN_SECS + hours * ONE_HOUR_IN_SECS + minutes * ONE_MINUTE_IN_SECS

export const emptyDuration = { days: undefined, hours: undefined, minutes: undefined }

export const getDuration = (startDate: Date, days: number, hours: number, minutes: number) => {
  const startTimestamp = startDate.getTime()
  const endTimestamp = add(startDate, {
    days,
    hours,
    minutes,
  }).getTime()
  return (endTimestamp - startTimestamp) / 1000
}

export const getFormattedDurationFromNowToDuration = (
  value: Duration,
  dateFormat: string,
): string | null => {
  if (!Object.values(value).some((val) => val > 0)) return null
  try {
    return format(add(Date.now(), value), dateFormat)
  } catch (e) {
    return ''
  }
}

export const sumDurations = (...durations: Duration[]): Duration => {
  return durations.reduce((result, current) => {
    for (const durationKey in current) {
      if (durationKey in current) {
        const sum = current[durationKey as keyof Duration] || 0
        result[durationKey as keyof Duration] = (result[durationKey as keyof Duration] || 0) + sum
      }
    }
    return result
  }, {})
}

export const isEmptyDuration = (
  duration: Duration | undefined,
  emptyValue?: undefined | number,
) => {
  return !duration ? true : Object.values(duration).every((v) => v === emptyValue)
}
