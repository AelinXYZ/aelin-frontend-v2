import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { getAddress } from '@ethersproject/address'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ConnectOptions, WalletState } from '@web3-onboard/core'
import { useConnectWallet, useSetChain } from '@web3-onboard/react'
import nullthrows from 'nullthrows'

import env from '@/config/env'
import {
  Chains,
  ChainsValues,
  getChainsByEnvironmentArray,
  getNetworkConfig,
} from '@/src/constants/chains'
import { Provider, useWeb3Provider } from '@/src/hooks/useWeb3Provider'
import { isSupportedNetworkId } from '@/src/utils/getDefaultNetwork'
import { getExplorerUrl } from '@/src/utils/getExplorerUrl'
import { RequiredNonNull } from '@/types/utils'

import '@/src/web3/onboard'

const STORAGE_CONNECTED_WALLET = 'onboard_selectedWallet'

// Default chain id from env var
const INITIAL_APP_CHAIN_ID = Number(env.NEXT_PUBLIC_REACT_APP_DEFAULT_CHAIN_ID || 4) as ChainsValues

nullthrows(
  Object.values(Chains).includes(INITIAL_APP_CHAIN_ID) ? INITIAL_APP_CHAIN_ID : null,
  'No default chain ID is defined or is not supported',
)

export type Web3Context = {
  address: string | null
  appChainId: ChainsValues
  connectWallet: () => void
  disconnectWallet: () => void
  isAppConnected: boolean
  isWalletConnected: boolean
  isWalletNetworkSupported: boolean
  pushNetwork: (chainId?: ChainsValues) => Promise<void>
  readOnlyAppProvider: JsonRpcProvider
  setAppChainId: Dispatch<SetStateAction<ChainsValues>>
  wallet: WalletState | null
  walletChainId: number | null
  web3Provider: Provider | null
  getExplorerUrl: (hash: string) => string
  changeWallet: () => void
}

const Web3ContextConnection = createContext<Web3Context | undefined>(undefined)

type Props = {
  children: ReactNode
}

export default function Web3ConnectionProvider({ children }: Props) {
  const [{ wallet }, connect, disconnect] = useConnectWallet()
  const [, setChain] = useSetChain()
  const [address, setAddress] = useState<string | null>(null)
  const [walletChainId, setWalletChainId] = useState<ChainsValues | null>(null)
  const [appChainId, setAppChainId] = useState<ChainsValues>(INITIAL_APP_CHAIN_ID)
  const supportedChainIds = getChainsByEnvironmentArray().map(({ chainId }) => chainId)

  const web3Provider = useWeb3Provider(wallet, walletChainId)

  const isWalletConnected = web3Provider != null && address != null
  const isAppConnected = walletChainId === appChainId && address !== null && web3Provider !== null
  const isWalletNetworkSupported = supportedChainIds.includes(walletChainId as any)

  const readOnlyAppProvider = useMemo(
    () => new JsonRpcProvider(getNetworkConfig(appChainId).rpcUrl, appChainId),
    [appChainId],
  )

  useEffect(() => {
    if (wallet?.accounts?.[0]?.address) {
      window.localStorage.setItem(STORAGE_CONNECTED_WALLET, wallet.label || '')
      setAddress(getAddress(wallet.accounts[0].address))
    } else {
      setAddress(null)
    }
    if (wallet?.chains) {
      const chainId = Number(wallet.chains[0].id)
      if (isSupportedNetworkId(chainId as ChainsValues)) {
        setWalletChainId(chainId as ChainsValues)
        setAppChainId(chainId as ChainsValues)
      } else {
        setWalletChainId(chainId as ChainsValues)
        console.error('Unsupported Network.')
      }
    }
  }, [wallet, setChain])

  useEffect(() => {
    let options: ConnectOptions = {}
    const previousConnection = window.localStorage.getItem(STORAGE_CONNECTED_WALLET)
    if (previousConnection) {
      options = {
        autoSelect: {
          label: previousConnection,
          disableModals: true,
        },
      }
      connect(options)
    }
  }, [connect])

  const changeWallet = async (): Promise<void> => {
    if (!wallet || wallet.label !== 'MetaMask') {
      console.warn('Unable to change wallet')
      return
    }

    const provider = wallet.provider
    try {
      await provider.request({
        method: 'wallet_requestPermissions',
        params: [
          {
            eth_accounts: {},
          },
        ],
      })
    } catch (_) {
      console.error('Unable to change wallet')
    }
  }

  const connectWallet = useCallback(() => {
    return connect()
  }, [connect])

  const disconnectWallet = useCallback(() => {
    if (wallet && disconnect) {
      window.localStorage.removeItem(STORAGE_CONNECTED_WALLET)
      disconnect(wallet)
    }
  }, [wallet, disconnect])

  const pushNetwork = async (chainId?: ChainsValues): Promise<void> => {
    if (!wallet || wallet.label !== 'MetaMask') {
      chainId && setAppChainId(chainId)
      console.warn('Unable to push network')
      return
    }

    const provider = wallet.provider
    const networkConfig = getNetworkConfig(chainId || appChainId)
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkConfig.chainIdHex }],
      })
      setAppChainId(networkConfig.chainId)
    } catch (switchError) {
      const config = {
        chainId: networkConfig.chainIdHex,
        chainName: networkConfig.name,
        rpcUrls: [networkConfig.defaultRpcUrl],
        nativeCurrency: networkConfig.nativeCurrency,
        blockExplorerUrls: networkConfig.blockExplorerUrls,
        iconUrls: networkConfig.iconUrls,
      }

      // This error code indicates that the chain has not been added to MetaMask.
      if ((switchError as { code: number }).code === 4902) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [config],
        })
      } else {
        throw switchError
      }
    }
  }

  const _getExplorerUrl = useCallback(
    (hash: string) => getExplorerUrl(hash, appChainId),
    [appChainId],
  )

  const value = {
    isAppConnected,
    isWalletConnected,
    isWalletNetworkSupported,
    appChainId,
    wallet,
    walletChainId,
    address,
    readOnlyAppProvider,
    web3Provider,
    getExplorerUrl: _getExplorerUrl,
    connectWallet,
    disconnectWallet,
    pushNetwork,
    setAppChainId: setAppChainId,
    changeWallet,
  }

  return <Web3ContextConnection.Provider value={value}>{children}</Web3ContextConnection.Provider>
}

export function useWeb3Connection() {
  const context = useContext(Web3ContextConnection)
  if (context === undefined) {
    throw new Error('useWeb3Connection must be used within a Web3ConnectionProvider')
  }
  return context
}

type Web3ConnectedContext = RequiredNonNull<Web3Context>

export function useWeb3Connected() {
  const context = useWeb3Connection()
  if (!context.isWalletConnected) {
    throw new Error('useWeb3Connected must be used within a connected context')
  }
  return context as Web3ConnectedContext
}
