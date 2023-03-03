import { faker } from '@faker-js/faker'

import { DirectDealPrivacy } from '../pages/aelin/create-direct-deal'

export default class DirectDealBuilder {
  constructor() {
    this.name = faker.datatype.string(30)
    this.symbol = faker.datatype.string(7)
    this.investmentTokenSymbol = 'WETH'
    this.creationDate = Date.now()
    this.redemptionDeadlineDays = 2
    this.sponsorFee = faker.datatype.number({ max: 15, min: 0, precision: 0.01 })
    this.holderAddress = '0x0000000000000000000000000000000000000000'
    this.dealTokenSymbol = 'UNI'
    this.privacy = DirectDealPrivacy.PUBLIC
    this.allowlistAddress = '0x0000000000000000000000000000000000000000'
    this.allowlistAmount = 1
    this.nftCollectionName = 'test'
    this.investmentAmountToRaise = 190
    this.exchangeRate = 2
    this.vestingCliff = faker.datatype.number({ max: 1824, min: 2 })
    this.vestingPeriod = faker.datatype.number({ max: 1824, min: 2 })
  }
}
