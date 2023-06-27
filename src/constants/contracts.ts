import AelinFeeDistributorABI from '@/src/abis/AelinFeeDistributorABI.json'
import AelinPoolFactoryABI from '@/src/abis/AelinPoolFactory.json'
import AelinStakingABI from '@/src/abis/AelinStaking.json'
import AelinUpfrontDealFactoryABI from '@/src/abis/AelinUpfrontDealFactory.json'
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
      [Chains.goerli]: '',
      [Chains.sepolia]: '',
      [Chains.optimism]: '0x61BAADcF22d2565B0F471b291C475db5555e0b76',
      [Chains.arbitrum]: '',
      [Chains.polygon]: '',
    },
    abi: ERC20,
  },
  POOL_FACTORY: {
    address: {
      [Chains.mainnet]: '0x722969A3fdc778a5cC7CbC8DC8Ae3e96a288f853',
      [Chains.goerli]: '0xcC416fb5EC99d912Dc69AdC25B033a41C170A56b',
      [Chains.sepolia]: '0xEACEce7A9BB56fF29657A2459eFE610A80C78c43',
      [Chains.optimism]: '0x8B35551d6459a3d49B9A5A0D7333c6D7E0cCbBd9',
      [Chains.arbitrum]: '0xbf7c0Fd0D31bC377f861d11d4aAc15296c0405b6',
      [Chains.polygon]: '0xbf7c0fd0d31bc377f861d11d4aac15296c0405b6',
    },
    abi: AelinPoolFactoryABI,
  },
  UPFRONT_DEAL_FACTORY: {
    address: {
      [Chains.mainnet]: '0x82BccFA913dB473147e5274C7821Bc13fFBaBE17',
      [Chains.goerli]: '0xBDF25B02082a1E7336429A8b84fE40f7140A07eE',
      [Chains.sepolia]: '0xf852a164518F49f4BFAD9e8fA2360f964Eee01cC',
      [Chains.optimism]: '0xe6355E5B217390A2F888c35f73248844847b0ef4',
      [Chains.arbitrum]: '0x91fCeA33D02d11621b7f90ebd5E44eD393eD7b5e',
      [Chains.polygon]: '0x82eaa001029d4686b343b53ce6e7f1823725e736',
    },
    abi: AelinUpfrontDealFactoryABI,
  },
  STAKING_REWARDS: {
    address: {
      [Chains.mainnet]: '',
      [Chains.optimism]: '0xFe757A40F3EdA520845b339c698b321663986a4d',
      [Chains.goerli]: '',
      [Chains.sepolia]: '',
      [Chains.arbitrum]: '',
      [Chains.polygon]: '',
    },
    abi: AelinStakingABI,
  },
  LP_TOKEN: {
    address: {
      [Chains.mainnet]: '0x974d51faFc9013E42CbbB9465ea03fE097824bcC',
      [Chains.optimism]: '0x665d8d87ac09bdbc1222b8b9e72ddcb82f76b54a',
      [Chains.goerli]: '',
      [Chains.sepolia]: '',
      [Chains.arbitrum]: '',
      [Chains.polygon]: '',
    },
    abi: ERC20,
  },
  LP_STAKING_REWARDS: {
    address: {
      [Chains.mainnet]: '0x944cb90082fc1416d4B551A21cFe6D7cc5447C80',
      [Chains.optimism]: '0x4aeC980a0Daef4905520a11b99971C7B9583f4F8',
      [Chains.goerli]: '',
      [Chains.sepolia]: '',
      [Chains.arbitrum]: '',
      [Chains.polygon]: '',
    },
    abi: AelinStakingABI,
  },
  GELATO_POOL: {
    address: {
      [Chains.mainnet]: '',
      [Chains.optimism]: '0x665d8D87ac09Bdbc1222B8B9E72Ddcb82f76B54A',
      [Chains.goerli]: '',
      [Chains.sepolia]: '',
      [Chains.arbitrum]: '',
      [Chains.polygon]: '',
    },
    abi: GelatoPoolABI,
  },
  FEE_DISTRIBUTOR: {
    address: {
      [Chains.mainnet]: '',
      [Chains.optimism]: '0xa621eEFAa0A6B23fA4C0111e9316cCa4b53469e6',
      [Chains.goerli]: '0xF5bF8E0B2F1efb98872c44f928e648f6bc190750',
      [Chains.sepolia]: '',
      [Chains.arbitrum]: '',
      [Chains.polygon]: '',
    },
    abi: AelinFeeDistributorABI,
  },
})
