import AelinPoolCreateABI from '@/src/abis/AelinPoolCreate.json'
import AelinStakingABI from '@/src/abis/AelinStaking.json'
import ERC20 from '@/src/abis/ERC20.json'
import GelatoPoolABI from '@/src/abis/GelatoPool.json'
import { Chains, ChainsValues } from '@/src/constants/chains'

type BaseAppContractInfo = {
  abi: any[]
  decimals?: number
  icon?: JSX.Element
  symbol?: string
  priceTokenId?: string
}

export type ChainAppContractInfo = BaseAppContractInfo & {
  address: string
}

export type AppContractInfo = BaseAppContractInfo & {
  address: { [key in ChainsValues]: string }
}

function constantContracts<T extends { [key in string]: AppContractInfo }>(o: T): T {
  return o
}

export const contracts = constantContracts({
  AELIN_TOKEN: {
    address: {
      [Chains.mainnet]: '0xa9C125BF4C8bB26f299c00969532B66732b1F758',
      [Chains.kovan]: '0x61BAADcF22d2565B0F471b291C475db5555e0b76',
      [Chains.goerli]: '',
      [Chains.optimism]: '0x61BAADcF22d2565B0F471b291C475db5555e0b76',
    },
    abi: ERC20,
  },
  POOL_CREATE: {
    address: {
      [Chains.mainnet]: '0x2C0979B0de5F99c2bde1E698AeCA13b55695951E',
      [Chains.kovan]: '0x3347b7C7F491B4cD665656796614A729036Ff220',
      [Chains.goerli]: '0x6aec692C25F8f4f735AC36FbCBD0d4b6dD944b0f',
      [Chains.optimism]: '0x9219f9f65B007Fd3bA0b53762861f54062531a31',
    },
    abi: AelinPoolCreateABI,
  },
  STAKING_REWARDS: {
    address: {
      [Chains.mainnet]: '',
      [Chains.optimism]: '0xFe757A40F3EdA520845b339c698b321663986a4d',
      [Chains.kovan]: '',
      [Chains.goerli]: '',
    },
    abi: AelinStakingABI,
  },
  LP_TOKEN: {
    address: {
      [Chains.mainnet]: '0x974d51faFc9013E42CbbB9465ea03fE097824bcC',
      [Chains.optimism]: '0x665d8d87ac09bdbc1222b8b9e72ddcb82f76b54a',
      [Chains.kovan]: '',
      [Chains.goerli]: '',
    },
    abi: ERC20,
  },
  LP_STAKING_REWARDS: {
    address: {
      [Chains.mainnet]: '0x944cb90082fc1416d4B551A21cFe6D7cc5447C80',
      [Chains.optimism]: '0x4aeC980a0Daef4905520a11b99971C7B9583f4F8',
      [Chains.kovan]: '',
      [Chains.goerli]: '',
    },
    abi: AelinStakingABI,
  },
  GELATO_POOL: {
    address: {
      [Chains.mainnet]: '',
      [Chains.optimism]: '0x665d8D87ac09Bdbc1222B8B9E72Ddcb82f76B54A',
      [Chains.kovan]: '',
      [Chains.goerli]: '',
    },
    abi: GelatoPoolABI,
  },
})
