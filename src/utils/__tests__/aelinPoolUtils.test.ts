import { parseUnits } from '@ethersproject/units'
import { noop } from 'lodash'

import {
  dealExchangeRates,
  getAmountRedeem,
  getInvestmentDealToken,
  getTokensSold,
  parseValuesToCreatePool,
  upfrontDealExchangeRates,
} from '../aelinPoolUtils'
import { NftType } from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { ZERO_BN } from '@/src/constants/misc'
import { CreatePoolStateComplete } from '@/src/hooks/aelin/useAelinCreatePool'

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
    const purchaseTokenPerDealToken = '1000000' // 1 with 6 decimals

    const dealTokenDecimals = 6
    const underlyingDealTokenTotal = '10000000' // 10 with 6 decimals

    const exchangeRate = dealExchangeRates(
      purchaseTokenPerDealToken,
      investmentTokenDecimals,
      underlyingDealTokenTotal,
      dealTokenDecimals,
    )

    const redeemed = getAmountRedeem(
      parseUnits('10', investmentTokenDecimals),
      investmentTokenDecimals,
    )

    const result = getTokensSold(
      redeemed,
      exchangeRate.dealPerInvestment,
      investmentTokenDecimals,
      dealTokenDecimals,
    )

    expect(result).toEqual({
      raw: parseUnits('100', dealTokenDecimals),
      formatted: '100',
    })
  })

  it('should handle the case where investmentTokenDecimals is greater than dealTokenDecimals', () => {
    const investmentTokenDecimals = 18
    const purchaseTokenPerDealToken = '1000000000000000000' // 1 with 18 decimals

    const dealTokenDecimals = 6
    const underlyingDealTokenTotal = '10000000' // 10 with 6 decimals

    const exchangeRate = dealExchangeRates(
      purchaseTokenPerDealToken,
      investmentTokenDecimals,
      underlyingDealTokenTotal,
      dealTokenDecimals,
    )

    const redeemed = getAmountRedeem(
      parseUnits('10', investmentTokenDecimals),
      investmentTokenDecimals,
    )

    const result = getTokensSold(
      redeemed,
      exchangeRate.dealPerInvestment,
      investmentTokenDecimals,
      dealTokenDecimals,
    )

    expect(result).toEqual({
      raw: parseUnits('100', investmentTokenDecimals),
      formatted: '100',
    })
  })

  it('should handle the case where investmentTokenDecimals is less than dealTokenDecimals', () => {
    const investmentTokenDecimals = 6
    const purchaseTokenPerDealToken = '1000000' // 1 with 6 decimals

    const dealTokenDecimals = 18
    const underlyingDealTokenTotal = '10000000000000000000' // 10 with 18 decimals

    const exchangeRate = dealExchangeRates(
      purchaseTokenPerDealToken,
      investmentTokenDecimals,
      underlyingDealTokenTotal,
      dealTokenDecimals,
    )

    const redeemed = getAmountRedeem(
      parseUnits('10', investmentTokenDecimals),
      investmentTokenDecimals,
    )

    const result = getTokensSold(
      redeemed,
      exchangeRate.dealPerInvestment,
      investmentTokenDecimals,
      dealTokenDecimals,
    )

    expect(result).toEqual({
      raw: parseUnits('100', dealTokenDecimals),
      formatted: '100',
    })
  })
})

describe('getInvestmentDealToken', () => {
  it('should handle the case where investmentTokenDecimals and dealTokenDecimals are equal', () => {
    const investmentTokenDecimals = 6
    const purchaseTokenPerDealToken = '1000000' // 1 with 6 decimals

    const dealTokenDecimals = 6
    const underlyingDealTokenTotal = '10000000' // 10 with 6 decimals

    const exchangeRate = dealExchangeRates(
      purchaseTokenPerDealToken,
      investmentTokenDecimals,
      underlyingDealTokenTotal,
      dealTokenDecimals,
    )

    const result = getInvestmentDealToken(
      underlyingDealTokenTotal,
      dealTokenDecimals,
      investmentTokenDecimals,
      exchangeRate.dealPerInvestment,
    )

    expect(result).toEqual({
      raw: parseUnits('1', dealTokenDecimals),
      formatted: '1',
    })
  })

  it('should handle the case where investmentTokenDecimals is greater than dealTokenDecimals', () => {
    const investmentTokenDecimals = 18
    const purchaseTokenPerDealToken = '1000000000000000000' // 1 with 18 decimals

    const dealTokenDecimals = 6
    const underlyingDealTokenTotal = '10000000' // 10 with 6 decimals

    const exchangeRate = dealExchangeRates(
      purchaseTokenPerDealToken,
      investmentTokenDecimals,
      underlyingDealTokenTotal,
      dealTokenDecimals,
    )

    const result = getInvestmentDealToken(
      underlyingDealTokenTotal,
      dealTokenDecimals,
      investmentTokenDecimals,
      exchangeRate.dealPerInvestment,
    )

    expect(result).toEqual({
      raw: parseUnits('1', investmentTokenDecimals),
      formatted: '1',
    })
  })

  it('should handle the case where investmentTokenDecimals is less than dealTokenDecimals', () => {
    const investmentTokenDecimals = 6
    const purchaseTokenPerDealToken = '1000000' // 1 with 6 decimals

    const dealTokenDecimals = 18
    const underlyingDealTokenTotal = '10000000000000000000' // 10 with 18 decimals

    const exchangeRate = dealExchangeRates(
      purchaseTokenPerDealToken,
      investmentTokenDecimals,
      underlyingDealTokenTotal,
      dealTokenDecimals,
    )

    const result = getInvestmentDealToken(
      underlyingDealTokenTotal,
      dealTokenDecimals,
      investmentTokenDecimals,
      exchangeRate.dealPerInvestment,
    )

    expect(result).toEqual({
      raw: parseUnits('1', dealTokenDecimals),
      formatted: '1',
    })
  })
})

describe('parseValuesToCreatePool', () => {
  it('should return the correct values to create public a pool', async () => {
    const variables = {
      [NftType.erc1155]: [],
      [NftType.erc721]: [],
      poolName: 'TEST',
      poolSymbol: 'TEST',
      investmentToken: {
        name: 'Wrapped Ether',
        address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        symbol: 'WETH',
        decimals: 18,
        chainId: 5,
      },
      investmentDeadLine: {
        minutes: 30,
      },
      dealDeadline: {
        minutes: 30,
      },
      poolCap: 0,
      sponsorFee: 0,
      poolPrivacy: 'public',
      currentStep: 'poolPrivacy',
      whitelist: [],
      nftCollectionRules: [],
    }

    const expectedVariables = await parseValuesToCreatePool(variables as CreatePoolStateComplete)

    expect(expectedVariables).toEqual({
      name: 'TEST',
      symbol: 'TEST',
      purchaseTokenCap: ZERO_BN,
      purchaseToken: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      sponsorFee: ZERO_BN,
      purchaseDuration: 1800,
      duration: 1800,
      allowListAddresses: [],
      allowListAmounts: [],
      nftCollectionRules: [],
    })
  })

  it('should return the correct values to create private a pool', async () => {
    const variables = {
      [NftType.erc1155]: undefined,
      [NftType.erc721]: undefined,
      poolName: 'TEST',
      poolSymbol: 'TEST',
      investmentToken: {
        name: 'Wrapped Ether',
        address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        symbol: 'WETH',
        decimals: 18,
        chainId: 5,
      },
      investmentDeadLine: {
        minutes: 30,
      },
      dealDeadline: {
        minutes: 30,
      },
      poolCap: 0,
      sponsorFee: 2,
      poolPrivacy: 'private',
      currentStep: 'poolPrivacy',
      whitelist: [
        {
          address: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
          amount: 1000000000000000000,
        },
      ],
      nftCollectionRules: [],
    }

    const expectedVariables = parseValuesToCreatePool(variables as CreatePoolStateComplete)

    expect(expectedVariables).toEqual({
      name: 'TEST',
      symbol: 'TEST',
      purchaseTokenCap: ZERO_BN,
      purchaseToken: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      // Sponsor fee use 18 decimals
      sponsorFee: parseUnits('2', 18),
      purchaseDuration: 1800,
      duration: 1800,
      allowListAddresses: ['0xa834e550B45B4a469a05B846fb637bfcB12e3Df8'],
      allowListAmounts: ['1000000000000000000'],
      nftCollectionRules: [],
    })
  })

  it('should return the correct values to create ERC-721 gated pool (limited per nft)', () => {
    const variables = {
      [NftType.erc1155]: undefined,
      [NftType.erc721]: [
        {
          collectionAddress: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
          purchaseAmountPerToken: true,
          purchaseAmount: 20,
          tokenIds: [],
          minTokensEligible: [],
        },
      ],
      poolName: 'TEST',
      poolSymbol: 'TEST',
      investmentToken: {
        name: 'Wrapped Ether',
        address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        symbol: 'WETH',
        decimals: 18,
        chainId: 5,
      },
      investmentDeadLine: {
        minutes: 30,
      },
      dealDeadline: {
        minutes: 30,
      },
      poolCap: 0,
      sponsorFee: 2,
      poolPrivacy: 'nft',
      currentStep: 'poolPrivacy',
      whitelist: [],
      nftCollectionRules: [],
    }

    const expectedVariables = parseValuesToCreatePool(variables as CreatePoolStateComplete)

    expect(expectedVariables).toEqual({
      name: 'TEST',
      symbol: 'TEST',
      purchaseTokenCap: ZERO_BN,
      purchaseToken: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      sponsorFee: parseUnits('2', 18),
      purchaseDuration: 1800,
      duration: 1800,
      allowListAddresses: [],
      allowListAmounts: [],
      nftCollectionRules: [
        {
          collectionAddress: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
          purchaseAmountPerToken: true,
          purchaseAmount: parseUnits('20', 18),
          tokenIds: [],
          minTokensEligible: [],
        },
      ],
    })
  })

  it('should return the correct values to create ERC-721 gated pool (unlimited)', () => {
    const variables = {
      [NftType.erc1155]: undefined,
      [NftType.erc721]: [
        {
          collectionAddress: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
          purchaseAmountPerToken: true,
          purchaseAmount: 0,
          tokenIds: [],
          minTokensEligible: [],
        },
      ],
      poolName: 'TEST',
      poolSymbol: 'TEST',
      investmentToken: {
        name: 'Wrapped Ether',
        address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        symbol: 'WETH',
        decimals: 18,
        chainId: 5,
      },
      investmentDeadLine: {
        minutes: 30,
      },
      dealDeadline: {
        minutes: 30,
      },
      poolCap: 0,
      sponsorFee: 2,
      poolPrivacy: 'nft',
      currentStep: 'poolPrivacy',
      whitelist: [],
      nftCollectionRules: [],
    }

    const expectedVariables = parseValuesToCreatePool(variables as CreatePoolStateComplete)

    expect(expectedVariables).toEqual({
      name: 'TEST',
      symbol: 'TEST',
      purchaseTokenCap: ZERO_BN,
      purchaseToken: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      sponsorFee: parseUnits('2', 18),
      purchaseDuration: 1800,
      duration: 1800,
      allowListAddresses: [],
      allowListAmounts: [],
      nftCollectionRules: [
        {
          collectionAddress: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
          purchaseAmountPerToken: true,
          purchaseAmount: ZERO_BN,
          tokenIds: [],
          minTokensEligible: [],
        },
      ],
    })
  })
})

describe('parseValuesToCreateUpFrontDeal', () => {
  it.skip('it should return the correct values to create an upfront deal', () => {
    noop()
  })
})
