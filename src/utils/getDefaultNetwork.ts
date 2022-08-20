import detectEthereumProvider from '@metamask/detect-provider'

import { ChainsValues, getChainsByEnvironmentArray } from '@/src/constants/chains'

const INITIAL_APP_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_REACT_APP_DEFAULT_CHAIN_ID || 4,
) as ChainsValues

type EthereumProvider = {
  isMetaMask: boolean
  chainId: string
}

function isSupportedNetworkId(id: ChainsValues): boolean {
  const supportedChainIds = getChainsByEnvironmentArray().map(({ chainId }) => chainId)
  return supportedChainIds.includes(id)
}

export async function getDefaultNetwork(walletConnected: boolean): Promise<ChainsValues> {
  try {
    if (walletConnected && window.ethereum) {
      const provider = (await detectEthereumProvider()) as EthereumProvider
      if (provider && provider.chainId) {
        const id = Number(provider.chainId) as ChainsValues
        return isSupportedNetworkId(id) ? id : INITIAL_APP_CHAIN_ID
      }
    }
    return INITIAL_APP_CHAIN_ID
  } catch (e) {
    return INITIAL_APP_CHAIN_ID
  }
}
