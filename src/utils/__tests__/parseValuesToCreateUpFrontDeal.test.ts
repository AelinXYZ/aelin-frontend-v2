import { HashZero } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'

import { parseValuesToCreateUpFrontDeal } from '../parseValuesToCreateUpFrontDeal'
import { AddressesWhiteListAmountFormat } from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
import { NftType } from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { ZERO_BN } from '@/src/constants/misc'
import { CreateUpFrontDealStateComplete } from '@/src/hooks/aelin/useAelinCreateUpFrontDeal'

describe('parseValuesToCreateUpFrontDeal', () => {
  it('it should return the correct values to create a public upfront deal', () => {
    const variables = {
      [NftType.erc1155]: undefined,
      [NftType.erc721]: undefined,
      dealAttributes: {
        name: 'TEST',
        symbol: 'TEST',
      },
      investmentToken: {
        name: 'USDC',
        address: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
        symbol: 'USDC',
        decimals: 6,
        chainId: 5,
      },
      redemptionDeadline: {
        minutes: 30,
      },
      sponsorFee: 0,
      holderAddress: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
      dealToken: {
        name: 'Wrapped Ether',
        address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        symbol: 'WETH',
        decimals: 18,
        chainId: 5,
      },
      dealPrivacy: 'public',
      exchangeRates: {
        investmentTokenToRaise: 1000,
        exchangeRates: '0.5',
        isCapped: false,
        hasDealMinimum: false,
      },
      vestingSchedule: {
        vestingCliff: {
          minutes: 30,
        },
        vestingPeriod: {
          minutes: 30,
        },
      },
      currentStep: 'vestingSchedule',
      whitelist: [],
      withMerkleTree: false,
      nftCollectionRules: [],
    }

    const expectedVariables = parseValuesToCreateUpFrontDeal(
      variables as CreateUpFrontDealStateComplete,
      '0xa834e550b45b4a469a05b846fb637bfcb12e3df8',
    )

    expect(expectedVariables).toEqual([
      {
        name: 'TEST',
        symbol: 'TEST',
        purchaseToken: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
        underlyingDealToken: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        holder: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
        sponsor: '0xa834e550b45b4a469a05b846fb637bfcb12e3df8',
        sponsorFee: ZERO_BN,
        merkleRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
        ipfsHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
      {
        underlyingDealTokenTotal: parseUnits('500', 18),
        purchaseTokenPerDealToken: parseUnits('2', 6),
        purchaseRaiseMinimum: ZERO_BN,
        purchaseDuration: 1800,
        vestingPeriod: 1800,
        vestingCliffPeriod: 1800,
        allowDeallocation: true,
      },
      [],
      {
        allowListAddresses: [],
        allowListAmounts: [],
      },
    ])
  })

  it('should return the correct values to create a merkle tree upfront deal', () => {
    const variables = {
      [NftType.erc1155]: undefined,
      [NftType.erc721]: undefined,
      dealAttributes: {
        name: 'TEST',
        symbol: 'TEST',
      },
      investmentToken: {
        name: 'USDC',
        address: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
        symbol: 'USDC',
        decimals: 6,
        chainId: 5,
      },
      redemptionDeadline: {
        minutes: 30,
      },
      sponsorFee: 0,
      holderAddress: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
      dealToken: {
        name: 'Wrapped Ether',
        address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        symbol: 'WETH',
        decimals: 18,
        chainId: 5,
      },
      dealPrivacy: 'private',
      exchangeRates: {
        investmentTokenToRaise: 400,
        exchangeRates: '0.5',
        isCapped: false,
        hasDealMinimum: false,
      },
      vestingSchedule: {
        vestingCliff: {
          minutes: 30,
        },
        vestingPeriod: {
          minutes: 30,
        },
      },
      currentStep: 'vestingSchedule',
      whitelist: [
        {
          index: 0,
          address: '0xEade2f82c66eBda112987edd95E26cd3088f33DD',
          amount: '50000000',
        },
        {
          index: 1,
          address: '0xF25128854443E18290FFD61200E051d94B8e4069',
          amount: '50000000',
        },
        {
          index: 2,
          address: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
          amount: '50000000',
        },
        {
          index: 3,
          address: '0x051C7C18E63FE9Ec71BB4B5D2fCE2807F764dB5e',
          amount: '50000000',
        },
        {
          index: 4,
          address: '0x6144DAf8e2e583cD30C3567861C8E1D95cfA51B5',
          amount: '100000000',
        },
        {
          index: 5,
          address: '0x4F1abd0E5c4506C95a4Fd5259371BD9a877D9488',
          amount: '50000000',
        },
        {
          index: 6,
          address: '0x4b3337f7f0f95c21b91f4e9be5f90d4992129c58',
          amount: '50000000',
        },
      ],
      whiteListAmountFormat: AddressesWhiteListAmountFormat.uint256,
      withMerkleTree: true,
      nftCollectionRules: [],
    }

    const expectedVariables = parseValuesToCreateUpFrontDeal(
      variables as CreateUpFrontDealStateComplete,
      '0xa834e550b45b4a469a05b846fb637bfcb12e3df8',
    )

    expect(expectedVariables).toEqual([
      {
        name: 'TEST',
        symbol: 'TEST',
        purchaseToken: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
        underlyingDealToken: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        holder: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
        sponsor: '0xa834e550b45b4a469a05b846fb637bfcb12e3df8',
        sponsorFee: ZERO_BN,
        merkleRoot: HashZero,
        ipfsHash: HashZero,
      },
      {
        underlyingDealTokenTotal: parseUnits('200', 18), // deal token has 18 decimals
        purchaseTokenPerDealToken: parseUnits('2', 6), // investment token has 6 decimals
        purchaseRaiseMinimum: ZERO_BN,
        purchaseDuration: 1800,
        vestingPeriod: 1800,
        vestingCliffPeriod: 1800,
        allowDeallocation: true,
      },
      [],
      {
        allowListAddresses: [
          '0xEade2f82c66eBda112987edd95E26cd3088f33DD',
          '0xF25128854443E18290FFD61200E051d94B8e4069',
          '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
          '0x051C7C18E63FE9Ec71BB4B5D2fCE2807F764dB5e',
          '0x6144DAf8e2e583cD30C3567861C8E1D95cfA51B5',
          '0x4F1abd0E5c4506C95a4Fd5259371BD9a877D9488',
          '0x4b3337f7f0f95c21b91f4e9be5f90d4992129c58',
        ],
        allowListAmounts: [
          '50000000',
          '50000000',
          '50000000',
          '50000000',
          '100000000',
          '50000000',
          '50000000',
        ],
      },
    ])
  })

  it('should return the correct values to create a merkle tree upfront deal with decimal amount format', () => {
    const variables = {
      [NftType.erc1155]: undefined,
      [NftType.erc721]: undefined,
      dealAttributes: {
        name: 'TEST',
        symbol: 'TEST',
      },
      investmentToken: {
        name: 'USDC',
        address: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
        symbol: 'USDC',
        decimals: 6,
        chainId: 5,
      },
      redemptionDeadline: {
        minutes: 30,
      },
      sponsorFee: 0,
      holderAddress: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
      dealToken: {
        name: 'Wrapped Ether',
        address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        symbol: 'WETH',
        decimals: 18,
        chainId: 5,
      },
      dealPrivacy: 'private',
      exchangeRates: {
        investmentTokenToRaise: 400,
        exchangeRates: '0.5',
        isCapped: false,
        hasDealMinimum: false,
      },
      vestingSchedule: {
        vestingCliff: {
          minutes: 30,
        },
        vestingPeriod: {
          minutes: 30,
        },
      },
      currentStep: 'vestingSchedule',
      whitelist: [
        {
          index: 0,
          address: '0xEade2f82c66eBda112987edd95E26cd3088f33DD',
          amount: '50',
        },
        {
          index: 1,
          address: '0xF25128854443E18290FFD61200E051d94B8e4069',
          amount: '50',
        },
        {
          index: 2,
          address: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
          amount: '50',
        },
        {
          index: 3,
          address: '0x051C7C18E63FE9Ec71BB4B5D2fCE2807F764dB5e',
          amount: '50',
        },
        {
          index: 4,
          address: '0x6144DAf8e2e583cD30C3567861C8E1D95cfA51B5',
          amount: '100',
        },
        {
          index: 5,
          address: '0x4F1abd0E5c4506C95a4Fd5259371BD9a877D9488',
          amount: '50',
        },
        {
          index: 6,
          address: '0x4b3337f7f0f95c21b91f4e9be5f90d4992129c58',
          amount: '50',
        },
      ],
      whiteListAmountFormat: AddressesWhiteListAmountFormat.decimal,
      withMerkleTree: true,
      nftCollectionRules: [],
    }

    const expectedVariables = parseValuesToCreateUpFrontDeal(
      variables as CreateUpFrontDealStateComplete,
      '0xa834e550b45b4a469a05b846fb637bfcb12e3df8',
    )

    expect(expectedVariables).toEqual([
      {
        name: 'TEST',
        symbol: 'TEST',
        purchaseToken: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
        underlyingDealToken: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        holder: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
        sponsor: '0xa834e550b45b4a469a05b846fb637bfcb12e3df8',
        sponsorFee: ZERO_BN,
        merkleRoot: HashZero,
        ipfsHash: HashZero,
      },
      {
        underlyingDealTokenTotal: parseUnits('200', 18), // deal token has 18 decimals
        purchaseTokenPerDealToken: parseUnits('2', 6), // investment token has 6 decimals
        purchaseRaiseMinimum: ZERO_BN,
        purchaseDuration: 1800,
        vestingPeriod: 1800,
        vestingCliffPeriod: 1800,
        allowDeallocation: true,
      },
      [],
      {
        allowListAddresses: [
          '0xEade2f82c66eBda112987edd95E26cd3088f33DD',
          '0xF25128854443E18290FFD61200E051d94B8e4069',
          '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
          '0x051C7C18E63FE9Ec71BB4B5D2fCE2807F764dB5e',
          '0x6144DAf8e2e583cD30C3567861C8E1D95cfA51B5',
          '0x4F1abd0E5c4506C95a4Fd5259371BD9a877D9488',
          '0x4b3337f7f0f95c21b91f4e9be5f90d4992129c58',
        ],
        allowListAmounts: [50000000, 50000000, 50000000, 50000000, 100000000, 50000000, 50000000],
      },
    ])
  })

  it('should return the correct values to create ERC-721 gated pool (limited per nft)', () => {
    const variables = {
      [NftType.erc1155]: undefined,
      [NftType.erc721]: [
        {
          collectionAddress: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
          purchaseAmountPerToken: true,
          purchaseAmount: 500,
          tokenIds: [],
          minTokensEligible: [],
        },
      ],
      dealAttributes: {
        name: 'TEST',
        symbol: 'TEST',
      },
      investmentToken: {
        name: 'USDC',
        address: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
        symbol: 'USDC',
        decimals: 6,
        chainId: 5,
      },
      redemptionDeadline: {
        minutes: 30,
      },
      sponsorFee: 0,
      holderAddress: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
      dealToken: {
        name: 'Wrapped Ether',
        address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        symbol: 'WETH',
        decimals: 18,
        chainId: 5,
      },
      dealPrivacy: 'nft',
      exchangeRates: {
        investmentTokenToRaise: 400,
        exchangeRates: '0.5',
        isCapped: false,
        hasDealMinimum: false,
      },
      vestingSchedule: {
        vestingCliff: {
          minutes: 30,
        },
        vestingPeriod: {
          minutes: 30,
        },
      },
      currentStep: 'vestingSchedule',
      whitelist: [],
      withMerkleTree: false,
      nftCollectionRules: [],
    }

    const expectedVariables = parseValuesToCreateUpFrontDeal(
      variables as CreateUpFrontDealStateComplete,
      '0xa834e550b45b4a469a05b846fb637bfcb12e3df8',
    )

    expect(expectedVariables).toEqual([
      {
        name: 'TEST',
        symbol: 'TEST',
        purchaseToken: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
        underlyingDealToken: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        holder: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
        sponsor: '0xa834e550b45b4a469a05b846fb637bfcb12e3df8',
        sponsorFee: ZERO_BN,
        merkleRoot: HashZero,
        ipfsHash: HashZero,
      },
      {
        underlyingDealTokenTotal: parseUnits('200', 18), // deal token has 18 decimals
        purchaseTokenPerDealToken: parseUnits('2', 6), // investment token has 6 decimals
        purchaseRaiseMinimum: ZERO_BN,
        purchaseDuration: 1800,
        vestingPeriod: 1800,
        vestingCliffPeriod: 1800,
        allowDeallocation: true,
      },
      [
        {
          collectionAddress: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
          purchaseAmountPerToken: true,
          purchaseAmount: parseUnits('500', 6), // investment token has 6 decimals
          tokenIds: [],
          minTokensEligible: [],
        },
      ],
      {
        allowListAddresses: [],
        allowListAmounts: [],
      },
    ])
  })

  it('should return the correct values to create ERC-721 gated pool (unlimited)', () => {
    const variables = {
      [NftType.erc1155]: undefined,
      [NftType.erc721]: [
        {
          collectionAddress: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
          purchaseAmountPerToken: false,
          purchaseAmount: 0,
          tokenIds: [],
          minTokensEligible: [],
        },
      ],
      dealAttributes: {
        name: 'TEST',
        symbol: 'TEST',
      },
      investmentToken: {
        name: 'USDC',
        address: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
        symbol: 'USDC',
        decimals: 6,
        chainId: 5,
      },
      redemptionDeadline: {
        minutes: 30,
      },
      sponsorFee: 0,
      holderAddress: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
      dealToken: {
        name: 'Wrapped Ether',
        address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        symbol: 'WETH',
        decimals: 18,
        chainId: 5,
      },
      dealPrivacy: 'nft',
      exchangeRates: {
        investmentTokenToRaise: 400,
        exchangeRates: '0.5',
        isCapped: false,
        hasDealMinimum: false,
      },
      vestingSchedule: {
        vestingCliff: {
          minutes: 30,
        },
        vestingPeriod: {
          minutes: 30,
        },
      },
      currentStep: 'vestingSchedule',
      whitelist: [],
      withMerkleTree: false,
      nftCollectionRules: [],
    }

    const expectedVariables = parseValuesToCreateUpFrontDeal(
      variables as CreateUpFrontDealStateComplete,
      '0xa834e550b45b4a469a05b846fb637bfcb12e3df8',
    )

    expect(expectedVariables).toEqual([
      {
        name: 'TEST',
        symbol: 'TEST',
        purchaseToken: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
        underlyingDealToken: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        holder: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
        sponsor: '0xa834e550b45b4a469a05b846fb637bfcb12e3df8',
        sponsorFee: ZERO_BN,
        merkleRoot: HashZero,
        ipfsHash: HashZero,
      },
      {
        underlyingDealTokenTotal: parseUnits('200', 18), // deal token has 18 decimals
        purchaseTokenPerDealToken: parseUnits('2', 6), // investment token has 6 decimals
        purchaseRaiseMinimum: ZERO_BN,
        purchaseDuration: 1800,
        vestingPeriod: 1800,
        vestingCliffPeriod: 1800,
        allowDeallocation: true,
      },
      [
        {
          collectionAddress: '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b',
          purchaseAmountPerToken: false,
          purchaseAmount: ZERO_BN, // investment token has 6 decimals
          tokenIds: [],
          minTokensEligible: [],
        },
      ],
      {
        allowListAddresses: [],
        allowListAmounts: [],
      },
    ])
  })

  it('should return the correct values to create ERC-1155 gated pool (minimum amount)', () => {
    const variables = {
      [NftType.erc1155]: [
        {
          collectionAddress: '0x0771aAdbDDA5edD20d682d1d4877065361858522',
          purchaseAmountPerToken: false,
          purchaseAmount: 0,
          tokenIds: [parseUnits('1', 6), parseUnits('2', 6)],
          minTokensEligible: [parseUnits('500', 6), parseUnits('500', 6)],
        },
      ],
      [NftType.erc721]: undefined,
      dealAttributes: {
        name: 'TEST',
        symbol: 'TEST',
      },
      investmentToken: {
        name: 'USDC',
        address: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
        symbol: 'USDC',
        decimals: 6,
        chainId: 5,
      },
      redemptionDeadline: {
        minutes: 30,
      },
      sponsorFee: 0,
      holderAddress: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
      dealToken: {
        name: 'Wrapped Ether',
        address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        symbol: 'WETH',
        decimals: 18,
        chainId: 5,
      },
      dealPrivacy: 'nft',
      exchangeRates: {
        investmentTokenToRaise: 400,
        exchangeRates: '0.5',
        isCapped: false,
        hasDealMinimum: false,
      },
      vestingSchedule: {
        vestingCliff: {
          minutes: 30,
        },
        vestingPeriod: {
          minutes: 30,
        },
      },
      currentStep: 'vestingSchedule',
      whitelist: [],
      withMerkleTree: false,
      nftCollectionRules: [],
    }

    const expectedVariables = parseValuesToCreateUpFrontDeal(
      variables as CreateUpFrontDealStateComplete,
      '0xa834e550b45b4a469a05b846fb637bfcb12e3df8',
    )

    expect(expectedVariables).toEqual([
      {
        name: 'TEST',
        symbol: 'TEST',
        purchaseToken: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
        underlyingDealToken: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        holder: '0xa834e550B45B4a469a05B846fb637bfcB12e3Df8',
        sponsor: '0xa834e550b45b4a469a05b846fb637bfcb12e3df8',
        sponsorFee: ZERO_BN,
        merkleRoot: HashZero,
        ipfsHash: HashZero,
      },
      {
        underlyingDealTokenTotal: parseUnits('200', 18), // deal token has 18 decimals
        purchaseTokenPerDealToken: parseUnits('2', 6), // investment token has 6 decimals
        purchaseRaiseMinimum: ZERO_BN,
        purchaseDuration: 1800,
        vestingPeriod: 1800,
        vestingCliffPeriod: 1800,
        allowDeallocation: true,
      },
      [
        {
          collectionAddress: '0x0771aAdbDDA5edD20d682d1d4877065361858522',
          purchaseAmountPerToken: false,
          purchaseAmount: ZERO_BN,
          tokenIds: [parseUnits('1', 6), parseUnits('2', 6)],
          minTokensEligible: [parseUnits('500', 6), parseUnits('500', 6)],
        },
      ],
      {
        allowListAddresses: [],
        allowListAmounts: [],
      },
    ])
  })
})
