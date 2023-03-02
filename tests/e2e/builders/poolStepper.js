import { faker } from '@faker-js/faker'
import add from 'date-fns/add'
import format from 'date-fns/format'

import { PoolPrivacy } from '../pages/aelin/create-pool'

const PURCHASE_TOKEN_SYMBOL = ['WETH', 'UNI', 'USDC']

export default class PoolStepperBuilder {
  constructor() {
    this.name = this.createPoolId('E2E')
    this.symbol = 'E2E'
    this.investmentDeadlineMinutes = 2
    this.dealDeadlineDays = faker.datatype.number({ max: 30, min: 0 })
    this.dealDeadlineHours = faker.datatype.number({ max: 23, min: 0 })
    this.dealDeadlineMinutes = faker.datatype.number({ max: 30, min: 5 })
    this.poolCap = faker.datatype.number({ max: 20, min: 1, precision: 0.01 })
    this.sponsorFee = faker.datatype.number({ max: 15, min: 0, precision: 0.01 })
    this.privacy = PoolPrivacy.PUBLIC
    this.purchaseTokensAmt = faker.datatype.number({ max: 2, min: 0.005, precision: 0.0000000001 })
    this.totalDeposited =
      this.purchaseTokensAmt >= this.poolCap ? this.poolCap : this.purchaseTokensAmt
    this.creationDate = Date.now()
    this.purchaseTokenSymbol =
      PURCHASE_TOKEN_SYMBOL[Math.floor(Math.random() * PURCHASE_TOKEN_SYMBOL.length)]
  }

  createPoolId(poolName) {
    const date = new Date()
    const components = [
      date.getYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    ]
    return poolName + '-' + components.join('')
  }

  getDealDeadlineDuration() {
    return format(
      add(this.creationDate, {
        minutes: this.dealDeadlineMinutes + this.investmentDeadlineMinutes,
        hours: this.dealDeadlineHours,
        days: this.dealDeadlineDays,
      }),
      '~LLL dd, yyyy hh:mm a',
    )
  }

  getInvestmentDeadlineDuration() {
    return format(
      add(this.creationDate, {
        minutes: this.investmentDeadlineMinutes,
      }),
      '~LLL dd, yyyy hh:mm a',
    )
  }

  getFormattedCreationDate() {
    return format(this.creationDate, 'LLL dd, yyyy hh:mm a')
  }

  getDealDeadLineWithPrefix(prefix) {
    return `${prefix}${this.getDealDeadlineDuration().slice(1)}`
  }

  getInvestmentDeadLineWithPrefix(prefix) {
    return `${prefix}${this.getInvestmentDeadlineDuration().slice(1)}`
  }

  getFormattedPurchaseTokens() {
    return Intl.NumberFormat('en', {
      maximumFractionDigits: 2,
    }).format(this.purchaseTokensAmt)
  }
}
