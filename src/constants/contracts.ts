import AelinDirectDealFactoryABI from '@/src/abis/AelinDirectDealFactory.json'
import AelinRegularPoolFactoryABI from '@/src/abis/AelinRegularPoolFactory.json'
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
      [Chains.goerli]: '',
      [Chains.optimism]: '0x61BAADcF22d2565B0F471b291C475db5555e0b76',
      [Chains.arbitrum]: '',
      [Chains.polygon]: '',
    },
    abi: ERC20,
  },
  REGULAR_POOL_FACTORY: {
    address: {
      [Chains.mainnet]: '0x722969A3fdc778a5cC7CbC8DC8Ae3e96a288f853',
      [Chains.goerli]:
        (process.env.NEXT_PUBLIC_AELIN_POOL_FACTORY as string) ??
        '0xb52736cE26345942134b11083e88A0DD9Ef1be5A',
      [Chains.optimism]: '0x8B35551d6459a3d49B9A5A0D7333c6D7E0cCbBd9',
      [Chains.arbitrum]: '0xbf7c0Fd0D31bC377f861d11d4aAc15296c0405b6',
      [Chains.polygon]: '0xbf7c0fd0d31bc377f861d11d4aac15296c0405b6',
    },
    abi: AelinRegularPoolFactoryABI,
  },
  DIRECT_DEALS_FACTORY: {
    address: {
      [Chains.mainnet]: '0x97efdb29c0d6dacdc0bb334cc227ae03a1a7c01e',
      [Chains.goerli]:
        (process.env.NEXT_PUBLIC_AELIN_DEAL_FACTORY as string) ??
        '0x50c4eea08ae5544b622c96683823cecdc8b0e8ba',
      [Chains.optimism]: '0xe6355E5B217390A2F888c35f73248844847b0ef4',
      [Chains.arbitrum]: '0x91fCeA33D02d11621b7f90ebd5E44eD393eD7b5e',
      [Chains.polygon]: '0x82eaa001029d4686b343b53ce6e7f1823725e736',
    },
    abi: AelinDirectDealFactoryABI,
  },
  STAKING_REWARDS: {
    address: {
      [Chains.mainnet]: '',
      [Chains.optimism]: '0xFe757A40F3EdA520845b339c698b321663986a4d',
      [Chains.goerli]: '',
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
      [Chains.arbitrum]: '',
      [Chains.polygon]: '',
    },
    abi: GelatoPoolABI,
  },
})
