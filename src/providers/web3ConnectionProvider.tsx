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

import { JsonRpcProvider } from '@ethersproject/providers'
import coinbaseModule from '@web3-onboard/coinbase'
import { ConnectOptions, WalletState } from '@web3-onboard/core'
import gnosisModule from '@web3-onboard/gnosis'
import injectedModule from '@web3-onboard/injected-wallets'
import { init, useConnectWallet, useSetChain } from '@web3-onboard/react'
import walletConnectModule from '@web3-onboard/walletconnect'
import nullthrows from 'nullthrows'

import { AelinIconString, AelinLogoString } from '../components/assets/Logo'
import {
  Chains,
  ChainsValues,
  chainsConfig,
  getChainsByEnvironmentArray,
  getNetworkConfig,
} from '@/src/constants/chains'
import { Provider, useWeb3Provider } from '@/src/hooks/useWeb3Provider'
import { isSupportedNetworkId } from '@/src/utils/getDefaultNetwork'
import { getExplorerUrl } from '@/src/utils/getExplorerUrl'
import { RequiredNonNull } from '@/types/utils'

const STORAGE_CONNECTED_WALLET = 'onboard_selectedWallet'
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME

// Default chain id from env var
const INITIAL_APP_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_REACT_APP_DEFAULT_CHAIN_ID || 4,
) as ChainsValues

nullthrows(
  Object.values(Chains).includes(INITIAL_APP_CHAIN_ID) ? INITIAL_APP_CHAIN_ID : null,
  'No default chain ID is defined or is not supported',
)

export const SynthetixIcon = `<svg width="340" height="240" viewBox="0 0 340 240" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M82.1483 55.9193C79.7711 53.1998 76.8443 51.8369 73.3615 51.8369H2.13439C1.50174 51.8369 0.984118 51.6367 0.594305 51.2362C0.198102 50.8421 0 50.3964 0 49.9184V1.91845C0 1.44045 0.198102 1.00121 0.594305 0.600727C0.984118 0.200242 1.50174 0 2.13439 0H77.4003C96.3925 0 112.777 7.76423 126.549 23.2798L144.832 45.5971L109.218 89.0367L82.1483 55.9193ZM213.688 23.0408C227.459 7.68026 243.921 0 263.073 0H338.102C338.735 0 339.208 0.161486 339.527 0.477998C339.84 0.800969 340 1.27897 340 1.91845V49.9184C340 50.3964 339.84 50.8421 339.527 51.2362C339.208 51.6367 338.735 51.8369 338.102 51.8369H266.875C263.392 51.8369 260.465 53.1998 258.088 55.9193L205.617 119.758L258.325 184.074C260.702 186.639 263.546 187.918 266.875 187.918H338.102C338.735 187.918 339.208 188.118 339.527 188.518C339.84 188.919 340 189.442 340 190.075V238.075C340 238.553 339.84 238.999 339.527 239.393C339.208 239.793 338.735 239.994 338.102 239.994H263.073C243.921 239.994 227.536 232.236 213.924 216.714L170.24 163.436L126.549 216.714C112.777 232.236 96.3158 239.994 77.1638 239.994H2.13439C1.50174 239.994 1.02246 239.793 0.709332 239.393C0.389813 238.992 0.236444 238.476 0.236444 237.83V189.83C0.236444 189.352 0.389813 188.912 0.709332 188.512C1.02246 188.111 1.50174 187.911 2.13439 187.911H73.3615C76.6845 187.911 79.6113 186.555 82.1483 183.829L133.668 120.953L213.688 23.0408Z" fill="#00D1FF"/>
</svg>
`

export const SynthetixLogo = `
`

const injected = injectedModule()
const gnosis = gnosisModule()
const walletConnect = walletConnectModule()
const coinbase = coinbaseModule()

init({
  wallets: [injected, coinbase, walletConnect, gnosis],
  chains: [
    {
      id: chainsConfig[Chains.mainnet].id,
      token: chainsConfig[Chains.mainnet].nativeCurrency.name,
      label: chainsConfig[Chains.mainnet].name,
      rpcUrl: chainsConfig[Chains.mainnet].rpcUrl,
    },
    {
      id: chainsConfig[Chains.optimism].id,
      token: chainsConfig[Chains.optimism].nativeCurrency.name,
      label: chainsConfig[Chains.optimism].name,
      rpcUrl: chainsConfig[Chains.optimism].rpcUrl,
    },
    {
      id: chainsConfig[Chains.arbitrum].id,
      token: chainsConfig[Chains.arbitrum].nativeCurrency.name,
      label: chainsConfig[Chains.arbitrum].name,
      rpcUrl: chainsConfig[Chains.arbitrum].rpcUrl,
    },
    {
      id: chainsConfig[Chains.goerli].id,
      token: chainsConfig[Chains.goerli].nativeCurrency.name,
      label: chainsConfig[Chains.goerli].name,
      rpcUrl: chainsConfig[Chains.goerli].rpcUrl,
    },
  ],
  appMetadata: {
    name: APP_NAME || 'Aelin',
    icon: AelinIconString,
    logo: AelinLogoString,
    description:
      'Across is the fastest, cheapest and most secure cross-chain bridge for Ethereum, Arbitrum, Optimism, Polygon, Boba and other Layer 1 and Layer 2 networks. Transfer tokens with Across.',
    recommendedInjectedWallets: [
      { name: 'Metamask', url: 'https://metamask.io' },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
      { name: 'WalletConnect', url: 'https://walletconnect.org/' },
      { name: 'Gnosis Safe', url: 'https://gnosis.safe/' },
    ],
  },
  accountCenter: {
    desktop: {
      enabled: false,
    },
    mobile: {
      enabled: false,
    },
  },
  notify: {
    enabled: false,
  },
})

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

  useEffect(() => {
    if (wallet?.accounts) {
      window.localStorage.setItem(STORAGE_CONNECTED_WALLET, wallet.label || '')
      setAddress(wallet.accounts[0].address)
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

  const connectWallet = useCallback(() => {
    return connect()
  }, [connect])

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
    }
    connect(options)
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
