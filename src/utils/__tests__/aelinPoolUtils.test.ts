import { BigNumber } from '@ethersproject/bignumber'

import { dealExchangeRates } from '../aelinPoolUtils'

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

    console.log('result: ', result)

    expect(result).toEqual({
      investmentPerDeal: {
        raw: BigNumber.from('0.5'),
        formatted: '0.5',
      },
      dealPerInvestment: {
        raw: BigNumber.from('2'),
        formatted: '2',
      },
    })
  })

  it.skip('should handle the case where investmentTokenDecimals is greater than dealTokenDecimals', () => {
    const investmentTokenAmount = '123456789000000' // 1.23456789 with decimals of 6
    const investmentTokenDecimals = 6
    const dealTokenAmount = '456789000000' // 4.56789 with decimals of 2
    const dealTokenDecimals = 2

    const result = dealExchangeRates(
      investmentTokenAmount,
      investmentTokenDecimals,
      dealTokenAmount,
      dealTokenDecimals,
    )

    expect(result).toEqual({
      investmentPerDeal: {
        raw: '0.27115969',
        formatted: '0.27115969',
      },
      dealPerInvestment: {
        raw: '3.67756732',
        formatted: '3.67756732',
      },
    })
  })

  it.skip('should handle the case where investmentTokenDecimals is less than dealTokenDecimals', () => {
    const investmentTokenAmount = '123400' // 1.2345 with decimals of 2
    const investmentTokenDecimals = 2
    const dealTokenAmount = '456789012000000' // 4.56789012 with decimals of 6
    const dealTokenDecimals = 6

    const result = dealExchangeRates(
      investmentTokenAmount,
      investmentTokenDecimals,
      dealTokenAmount,
      dealTokenDecimals,
    )

    expect(result).toEqual({
      investmentPerDeal: {
        raw: '0.27115969',
        formatted: '0.27115969',
      },
      dealPerInvestment: {
        raw: '3.67756732',
        formatted: '3.67756732',
      },
    })
  })
})
