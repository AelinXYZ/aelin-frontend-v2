import { JsonRpcProvider } from '@ethersproject/providers'
import useSWR from 'swr'

import { Chains, ChainsValues, getNetworkConfig } from '../constants/chains'
import { useWeb3Connection } from '../providers/web3ConnectionProvider'

const { rpcUrl } = getNetworkConfig(Chains.mainnet)

export const mainnetRpcProvider = new JsonRpcProvider(rpcUrl)

export const useEnsLookUpAddress = (address: string, network: ChainsValues) => {
  const { getExplorerUrl } = useWeb3Connection()

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
    {
      refreshWhenHidden: false,
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
    },
  )

  return {
    data,
    isValidating,
    explorerUrl: getExplorerUrl(address, network),
  }
}

const isValidENSName = (str: string) => str.length > 3 && str.includes('.')

export const ensResolver = async (name: string) => {
  if (isValidENSName(name)) {
    try {
      const ens = await mainnetRpcProvider.resolveName(name)
      if (!ens) throw new Error(`No address for this ens name`)
      return ens
    } catch (err) {
      console.log(err)
      return name
    }
  }
  return name
}
