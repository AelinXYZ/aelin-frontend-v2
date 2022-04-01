import AelinPoolCreateABI from '@/src/abis/AelinPoolCreate.json'
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
  ERC_20: {
    address: {
      [Chains.mainnet]: '',
      [Chains.kovan]: '',
      [Chains.goerli]: '',
      [Chains.optimism]: '',
    },
    abi: [],
  },
  POOL_CREATE: {
    address: {
      [Chains.mainnet]: '0x2C0979B0de5F99c2bde1E698AeCA13b55695951E',
      [Chains.kovan]: '0x3347b7C7F491B4cD665656796614A729036Ff220',
      [Chains.goerli]: '0xCA4d64B67486867a9E867D0E38E1F1e99B718EEb',
      [Chains.optimism]: '0x9219f9f65B007Fd3bA0b53762861f54062531a31',
    },
    abi: AelinPoolCreateABI,
  },
})
