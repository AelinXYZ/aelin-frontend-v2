import { parseUnits } from '@ethersproject/units'

import {
  dealExchangeRates,
  getAmountRedeem,
  getInvestmentDealToken,
  getTokensSold,
  upfrontDealExchangeRates,
} from '../aelinPoolUtils'

describe('dealExchangeRates', () => {
  it('should handle the case where investmentTokenDecimals and dealTokenDecimals are equal', () => {
    const investmentTokenAmount = '10000000' // 10 with 6 decimals
    const investmentTokenDecimals = 6
    const dealTokenAmount = '5000000' // 5 with 6 decimals
    const dealTokenDecimals = 6

    const result = dealExchangeRates(
      investmentTokenAmount,
      investmentTokenDecimals,
      dealTokenAmount,
      dealTokenDecimals,
    )

    expect(result).toEqual({
      investmentPerDeal: {
        raw: parseUnits('0.5', dealTokenDecimals),
        formatted: '0.5',
      },
      dealPerInvestment: {
        raw: parseUnits('2', dealTokenDecimals),
        formatted: '2',
      },
    })
  })

  it('should handle the case where investmentTokenDecimals is greater than dealTokenDecimals', () => {
    const investmentTokenAmount = '10000000000000000000' // 10 with 18 decimals
    const investmentTokenDecimals = 18
    const dealTokenAmount = '5000000' // 5 with 6 decimals
    const dealTokenDecimals = 6

    const result = dealExchangeRates(
      investmentTokenAmount,
      investmentTokenDecimals,
      dealTokenAmount,
      dealTokenDecimals,
    )

    expect(result).toEqual({
      investmentPerDeal: {
        raw: parseUnits('0.5', investmentTokenDecimals),
        formatted: '0.5',
      },
      dealPerInvestment: {
        raw: parseUnits('2', investmentTokenDecimals),
        formatted: '2',
      },
    })
  })

  it('should handle the case where investmentTokenDecimals is less than dealTokenDecimals', () => {
    const investmentTokenAmount = '10000000' // 10 with 6 decimals
    const investmentTokenDecimals = 6
    const dealTokenAmount = '5000000000000000000' // 5 with 18 decimals
    const dealTokenDecimals = 18

    const result = dealExchangeRates(
      investmentTokenAmount,
      investmentTokenDecimals,
      dealTokenAmount,
      dealTokenDecimals,
    )

    expect(result).toEqual({
      investmentPerDeal: {
        raw: parseUnits('0.5', dealTokenDecimals),
        formatted: '0.5',
      },
      dealPerInvestment: {
        raw: parseUnits('2', dealTokenDecimals),
        formatted: '2',
      },
    })
  })
})

describe('upfrontDealExchangeRates', () => {
  it('should handle the case where investmentTokenDecimals and dealTokenDecimals are equal', () => {
    const purchaseTokenPerDealToken = '10000000' // 10 with 6 decimals
    const investmentTokenDecimals = 6
    const dealTokenDecimals = 6

    const result = upfrontDealExchangeRates(
      purchaseTokenPerDealToken,
      investmentTokenDecimals,
      dealTokenDecimals,
    )

    console.log('result: ', result)

    expect(result).toEqual({
      investmentPerDeal: {
        raw: parseUnits('10', investmentTokenDecimals),
        formatted: '10',
      },
      dealPerInvestment: {
        raw: parseUnits('0.1', investmentTokenDecimals),
        formatted: '0.1',
      },
    })
  })

  it('should handle the case where investmentTokenDecimals is greater than dealTokenDecimals', () => {
    const purchaseTokenPerDealToken = '10000000000000000000' // 10 with 18 decimals
    const investmentTokenDecimals = 18
    const dealTokenDecimals = 6

    const result = upfrontDealExchangeRates(
      purchaseTokenPerDealToken,
      investmentTokenDecimals,
      dealTokenDecimals,
    )

    expect(result).toEqual({
      investmentPerDeal: {
        raw: parseUnits('10', investmentTokenDecimals),
        formatted: '10',
      },
      dealPerInvestment: {
        raw: parseUnits('0.1', investmentTokenDecimals),
        formatted: '0.1',
      },
    })
  })

  it('should handle the case where investmentTokenDecimals is less than dealTokenDecimals', () => {
    const purchaseTokenPerDealToken = '10000000' // 10 with 6 decimals
    const investmentTokenDecimals = 6
    const dealTokenDecimals = 18

    const result = upfrontDealExchangeRates(
      purchaseTokenPerDealToken,
      investmentTokenDecimals,
      dealTokenDecimals,
    )

    expect(result).toEqual({
      investmentPerDeal: {
        raw: parseUnits('10', dealTokenDecimals),
        formatted: '10',
      },
      dealPerInvestment: {
        raw: parseUnits('0.1', dealTokenDecimals),
        formatted: '0.1',
      },
    })
  })
})

describe('getTokensSold', () => {
  it('should handle the case where investmentTokenDecimals and dealTokenDecimals are equal', () => {
    const investmentTokenDecimals = 6
    const dealTokenDecimals = 6

    const redeemed = getAmountRedeem(
      parseUnits('10', investmentTokenDecimals),
      investmentTokenDecimals,
    )

    const rate = {
      raw: parseUnits('0.1', dealTokenDecimals),
      formatted: '0.1',
    }

    const result = getTokensSold(redeemed, rate, investmentTokenDecimals, dealTokenDecimals)

    expect(result).toEqual({
      raw: parseUnits('100', dealTokenDecimals),
      formatted: '100',
    })
  })

  it('should handle the case where investmentTokenDecimals is greater than dealTokenDecimals', () => {
    const investmentTokenDecimals = 18
    const dealTokenDecimals = 6

    const redeemed = getAmountRedeem(
      parseUnits('10', investmentTokenDecimals),
      investmentTokenDecimals,
    )

    const rate = {
      raw: parseUnits('0.1', dealTokenDecimals),
      formatted: '0.1',
    }

    const result = getTokensSold(redeemed, rate, investmentTokenDecimals, dealTokenDecimals)

    expect(result).toEqual({
      raw: parseUnits('100', investmentTokenDecimals),
      formatted: '100',
    })
  })

  it('should handle the case where investmentTokenDecimals is less than dealTokenDecimals', () => {
    const investmentTokenDecimals = 6
    const dealTokenDecimals = 18

    const redeemed = getAmountRedeem(
      parseUnits('10', investmentTokenDecimals),
      investmentTokenDecimals,
    )

    const rate = {
      raw: parseUnits('0.1', dealTokenDecimals),
      formatted: '0.1',
    }

    const result = getTokensSold(redeemed, rate, investmentTokenDecimals, dealTokenDecimals)

    expect(result).toEqual({
      raw: parseUnits('100', dealTokenDecimals),
      formatted: '100',
    })
  })
})

describe('getInvestmentDealToken', () => {
  it('should handle the case where investmentTokenDecimals and dealTokenDecimals are equal', () => {
    const underlyingDealTokenTotal = '10000000' // 10 with 6 decimals
    const dealTokenDecimals = 6
    const investmentTokenDecimals = 6

    const exchangeRate = {
      raw: parseUnits('0.1', dealTokenDecimals),
      formatted: '0.1',
    }

    const result = getInvestmentDealToken(
      underlyingDealTokenTotal,
      dealTokenDecimals,
      investmentTokenDecimals,
      exchangeRate,
    )

    expect(result).toEqual({
      raw: parseUnits('1', dealTokenDecimals),
      formatted: '1',
    })
  })

  it('should handle the case where investmentTokenDecimals is greater than dealTokenDecimals', () => {
    const underlyingDealTokenTotal = '10000000' // 10 with 6 decimals
    const dealTokenDecimals = 6
    const investmentTokenDecimals = 18

    const exchangeRate = {
      raw: parseUnits('0.1', investmentTokenDecimals),
      formatted: '0.1',
    }

    const result = getInvestmentDealToken(
      underlyingDealTokenTotal,
      dealTokenDecimals,
      investmentTokenDecimals,
      exchangeRate,
    )

    expect(result).toEqual({
      raw: parseUnits('1', investmentTokenDecimals),
      formatted: '1',
    })
  })

  it('should handle the case where investmentTokenDecimals is less than dealTokenDecimals', () => {
    const underlyingDealTokenTotal = '10000000000000000000' // 10 with 18 decimals
    const dealTokenDecimals = 18
    const investmentTokenDecimals = 6

    const exchangeRate = {
      raw: parseUnits('0.1', dealTokenDecimals),
      formatted: '0.1',
    }

    const result = getInvestmentDealToken(
      underlyingDealTokenTotal,
      dealTokenDecimals,
      investmentTokenDecimals,
      exchangeRate,
    )

    expect(result).toEqual({
      raw: parseUnits('1', dealTokenDecimals),
      formatted: '1',
    })
  })
})
