import { JsonRpcProvider } from '@ethersproject/providers'
import useSWR from 'swr'

import { Chains, getNetworkConfig } from '../constants/chains'

const { rpcUrl } = getNetworkConfig(Chains.mainnet)

export const mainnetRpcProvider = new JsonRpcProvider(rpcUrl)

// Get ens name by address
export const useEnsLookUpAddress = (address: string) => {
  const { data, isValidating } = useSWR(
    mainnetRpcProvider && address ? ['ensLookUpAddress', address] : null,

    async () => {
      try {
        const ens = await mainnetRpcProvider.lookupAddress(address)
        if (!ens) throw new Error(`No ens name for this address`)
        return ens
      } catch (err) {
        return address
      }
    },
  )

  return {
    data,
    isValidating,
  }
}

export const isValidENSName = (str: string) => str.length > 3 && str.includes('.')

// get address by ens name
export const ensResolver = async (name: string) => {
  if (isValidENSName(name)) {
    try {
      const ens = await mainnetRpcProvider.resolveName(name)
      if (!ens) throw new Error(`No address for this ens name`)
      return ens.toLowerCase()
    } catch (err) {
      console.log(err)
      return name
    }
  }
  return name
}

// Get address by ens name
export const useEnsResolver = (name: string | undefined) => {
  const { data, isValidating } = useSWR<string | null>(
    mainnetRpcProvider && name ? ['ensResolver', name] : null,
    async () => {
      if (!name || !isValidENSName) return null

      try {
        const ens = await mainnetRpcProvider.resolveName(name)
        if (!ens) throw new Error(`No address for this ens name`)
        return ens
      } catch (err) {
        return null
      }
    },
  )

  return {
    data,
    isValidating,
  }
}
