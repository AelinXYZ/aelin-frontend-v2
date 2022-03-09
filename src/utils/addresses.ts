import erc20 from '@/src/abis/ERC20.json'
import { Chains } from '@/src/constants/chains'
import { Contracts } from '@/types/Contracts'

export const addresses: {
  [key in keyof typeof Chains]: {
    [key in keyof typeof Contracts]: { address: string; abi: any[] }
  }
} = {
  mainnet: {
    USDC: {
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      abi: erc20,
    },
  },
  kovan: {
    USDC: {
      address: '0x13512979ade267ab5100878e2e0f485b568328a4',
      abi: erc20,
    },
  },
}
