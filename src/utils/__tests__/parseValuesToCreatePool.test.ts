import { parseUnits } from '@ethersproject/units'

import { AddressesWhiteListAmountFormat } from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
import { NftType } from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { ZERO_BN } from '@/src/constants/misc'
import { CreatePoolStateComplete } from '@/src/hooks/aelin/useAelinCreatePool'
import { parseValuesToCreatePool } from '@/src/utils/parseValuesToCreatePool'

describe('parseValuesToCreatePool', () => {
  it('should return the correct values to create a public pool', async () => {
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

  it('should return the correct values to create a private pool with uint256 amount format', async () => {
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
      whiteListAmountFormat: AddressesWhiteListAmountFormat.uint256,
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

  it('should return the correct values to create a private pool with decimal amount format', async () => {
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
          amount: 1,
        },
      ],
      whiteListAmountFormat: AddressesWhiteListAmountFormat.decimal,
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
          purchaseAmount: parseUnits('20', variables.investmentToken.decimals),
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

  it('should return the correct values to create ERC-1155 gated pool (minimum amount)', () => {
    const variables = {
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
      [NftType.erc721]: undefined,
      [NftType.erc1155]: [
        {
          collectionAddress: '0x0771aAdbDDA5edD20d682d1d4877065361858522',
          purchaseAmountPerToken: false,
          purchaseAmount: 0,
          tokenIds: [parseUnits('1', 18)],
          minTokensEligible: [parseUnits('100', 18)],
        },
      ],
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
          collectionAddress: '0x0771aAdbDDA5edD20d682d1d4877065361858522',
          purchaseAmountPerToken: false,
          purchaseAmount: ZERO_BN,
          tokenIds: [parseUnits('1', 18)],
          minTokensEligible: [parseUnits('100', 18)],
        },
      ],
    })
  })
})
