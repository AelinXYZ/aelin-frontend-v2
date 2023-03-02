/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable ui-testing/no-hard-wait */
import { faker } from '@faker-js/faker'
import add from 'date-fns/add'
import format from 'date-fns/format'

export default class DealBuilder {
  constructor(fakePool) {
    this.holderAddress = ''
    this.creationDate = ''
    this.poolName = fakePool.name
    this.totalInvestmentAmount = faker.datatype.number({
      max: fakePool.totalDeposited,
      min: 0.001,
      precision: 0.001,
    })
    this.dealTokenTotal = faker.datatype.number({
      max: 5 * fakePool.totalDeposited,
      min: 0.001,
      precision: 0.001,
    })
    this.vestingCliffMinutes = 2
    this.vestingPeriodMinutes = 2
    this.round1Minutes = 2
    this.round2Minutes = 2
    this.holderPeriodDays = faker.datatype.number({ max: 30, min: 0 })
    this.holderPeriodHours = faker.datatype.number({ max: 23, min: 0 })
    this.holderPeriodMinutes = faker.datatype.number({ max: 30, min: 5 })
  }

  setCreationDate() {
    this.creationDate = Date.now()
  }

  setHolderAddress(address) {
    this.holderAddress = address
  }

  getRound1Duration() {
    return format(
      add(this.creationDate, {
        minutes: this.round1Minutes,
      }),
      '~LLL dd, yyyy hh:mm a',
    )
  }

  getRound2Duration() {
    return format(
      add(this.creationDate, {
        minutes: this.round1Minutes + this.round2Minutes,
      }),
      '~LLL dd, yyyy hh:mm a',
    )
  }

  getVestingCliffDuration() {
    return format(
      add(this.creationDate, {
        minutes: this.vestingCliffMinutes + this.round1Minutes + this.round2Minutes,
      }),
      '~LLL dd, yyyy hh:mm a',
    )
  }

  getVestingPeriodDuration() {
    return format(
      add(this.creationDate, {
        minutes:
          this.vestingPeriodMinutes +
          this.vestingCliffMinutes +
          this.round1Minutes +
          this.round2Minutes,
      }),
      '~LLL dd, yyyy hh:mm a',
    )
  }

  getHolderPeriodDuration() {
    return format(
      add(this.creationDate, {
        minutes: this.holderPeriodMinutes,
        hours: this.holderPeriodHours,
        days: this.holderPeriodDays,
      }),
      '~LLL dd, yyyy hh:mm a',
    )
  }

  getFormattedCreationDate() {
    return format(this.creationDate, 'LLL dd, yyyy hh:mm a')
  }

  getFormattedAmt(amt) {
    return Intl.NumberFormat('en', {
      maximumFractionDigits: 2,
    }).format(amt)
  }

  toRegexDate(date) {
    // This is used to avoid failing a test due to date diff in minutes
    return new RegExp(
      date.slice(0, date.indexOf(':') + 2) + '\\d' + date.slice(date.indexOf(':') + 3),
      'g',
    )
  }
}
