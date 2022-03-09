import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import Onboard from 'bnc-onboard'
import { API, Wallet } from 'bnc-onboard/dist/src/interfaces'
import { Subscriptions } from 'bnc-onboard/dist/src/interfaces'
import nullthrows from 'nullthrows'

import { Chains, ChainsValues, chainsConfig, getNetworkConfig } from '@/src/constants/chains'
import { RequiredNonNull } from '@/types/utils'

const STORAGE_CONNECTED_WALLET = 'onboard_selectedWallet'

// give onboard a window to update its internal state after certain actions
const ONBOARD_STATE_DELAY = 100

// Default chain id from env var
const INITAL_APP_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_REACT_APP_DEFAULT_CHAIN_ID || 4,
) as ChainsValues

nullthrows(
  Object.values(Chains).includes(INITAL_APP_CHAIN_ID) ? INITAL_APP_CHAIN_ID : null,
  'No default chain ID is defined or is not supported',
)

// @TODO: Default VALUES to connect to multiple wallets
const PORTIS_KEY = 'Your Portis key here'
const APP_URL = 'Your app url here'
const CONTACT_EMAIL = 'Your contact email here'
const RPC_URL = 'https://<network>.infura.io/v3/<INFURA_KEY>'

export enum WalletType {
  MetaMask = 'metamask',
  Ledger = 'ledger',
  Portis = 'portis',
  Trezor = 'trezor',
  Coinbase = 'coinbase',
  WalletConnect = 'walletConnect',
}

// Instantiate WalletConnect
let onboard: API | null = null
function initOnboard(appChainId: ChainsValues, subscriptions: Subscriptions) {
  if (onboard !== null) {
    return
  }

  window.onboard = Onboard({
    networkId: appChainId,
    networkName: getNetworkConfig(appChainId).name,
    hideBranding: true,
    darkMode: true, // @TODO: it is a default value
    walletSelect: {
      heading: 'Select a Wallet',
      description: 'Pick a wallet to connect to FIAT DAO',
      wallets: [
        {
          walletName: WalletType.MetaMask,
          preferred: true,
        },
        {
          walletName: WalletType.Ledger,
          rpcUrl: RPC_URL,
          preferred: true,
        },
        {
          walletName: WalletType.Portis,
          apiKey: PORTIS_KEY,
          preferred: true,
          // label: 'Login with Email'
        },
        {
          walletName: WalletType.Trezor,
          appUrl: APP_URL,
          email: CONTACT_EMAIL,
          rpcUrl: RPC_URL,
          preferred: true,
        },
        {
          walletName: WalletType.Coinbase,
          preferred: true,
        },
        {
          walletName: WalletType.WalletConnect,
          preferred: true,
          rpc: Object.values(chainsConfig).reduce(
            (rpc, val) => ({
              ...rpc,
              [val.chainId]: val.rpcUrl,
            }),
            {},
          ),
        },
      ],
    },
    subscriptions: subscriptions,
    walletCheck: [
      { checkName: 'derivationPath' },
      { checkName: 'accounts' },
      { checkName: 'connect' },
    ],
  })

  onboard = window.onboard
}

export type Web3Context = {
  address: string | null
  appChainId: ChainsValues
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  isAppConnected: boolean
  isWalletConnected: boolean
  isWalletNetworkSupported: boolean
  pushNetwork: () => Promise<void>
  readOnlyAppProvider: JsonRpcProvider
  setAppChainId: Dispatch<SetStateAction<ChainsValues>>
  wallet: Wallet | null
  walletChainId: number | null
  web3Provider: Web3Provider | null
  getExplorerUrl: (hash: string) => string
}

const Web3ContextConnection = createContext<Web3Context | undefined>(undefined)

type Props = {
  children: ReactNode
}

export default function Web3ConnectionProvider({ children }: Props) {
  const [address, setAddress] = useState<string | null>(null)
  const [walletChainId, setWalletChainId] = useState<number | null>(null)
  const [tmpWallet, setTmpWallet] = useState<Wallet | null>(null)
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [appChainId, setAppChainId] = useState<ChainsValues>(INITAL_APP_CHAIN_ID)
  const supportedChainIds = Object.values(Chains)

  const web3Provider = wallet?.provider != null ? new Web3Provider(wallet.provider) : null

  const isWalletConnected = web3Provider != null && address != null

  const isAppConnected = walletChainId === appChainId && address !== null && web3Provider !== null

  const isWalletNetworkSupported = supportedChainIds.includes(walletChainId as any)

  const readOnlyAppProvider = useMemo(
    () => new JsonRpcProvider(getNetworkConfig(appChainId).rpcUrl, appChainId),
    [appChainId],
  )

  const _reconnectWallet = async (): Promise<void> => {
    if (!onboard) {
      console.warn('Unable to connect, onboard is not defined')
      return
    }

    const previouslySelectedWallet = window.localStorage.getItem(STORAGE_CONNECTED_WALLET)

    if (previouslySelectedWallet) {
      await onboard.walletSelect(previouslySelectedWallet)
    }
  }

  // Instantiate Onboard
  useEffect(() => {
    initOnboard(INITAL_APP_CHAIN_ID, {
      network: (network: number) => {
        setWalletChainId(network || null)
      },
      address: async (address: string | undefined) => {
        setAddress(address || null)
      },
      wallet: async (wallet: Wallet) => {
        if (wallet.name === undefined) {
          setWallet(null)
          setTmpWallet(null)
        } else {
          setTmpWallet(wallet)
        }
      },
    })
  }, [])

  // recover previous connection
  useEffect(() => {
    setTimeout(async () => {
      await _reconnectWallet()
    }, ONBOARD_STATE_DELAY)
  }, [])

  // efectively connect wallet
  useEffect(() => {
    if (!address || !tmpWallet) {
      return
    }

    const connectWallet = async () => {
      const appIsReady = await onboard?.walletCheck()

      const connectedWallet = tmpWallet
      if (appIsReady && connectedWallet) {
        window.localStorage.setItem(STORAGE_CONNECTED_WALLET, connectedWallet.name || '')
        setWallet(connectedWallet)
        setTmpWallet(null)
      }
    }

    connectWallet()
  }, [tmpWallet, address])

  const disconnectWallet = () => {
    if (!onboard) {
      console.warn('Unable to connect, onboard is not defined')
      return
    }
    onboard.walletReset()
    window.localStorage.removeItem(STORAGE_CONNECTED_WALLET)
  }

  const connectWallet = async (): Promise<void> => {
    if (!onboard) {
      console.warn('Unable to connect, onboard is not defined')
      return
    }
    if (await onboard.walletSelect()) {
      const isWalletCheck = await onboard.walletCheck()
      if (isWalletCheck) {
        const { address } = onboard.getState()
        setAddress(address)
      }
    }
  }

  const pushNetwork = async (): Promise<void> => {
    if (!onboard || !wallet || wallet.name !== 'MetaMask') {
      console.warn('Unable to push network')
      return
    }

    const provider = wallet.provider
    const networkConfig = getNetworkConfig(appChainId)

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkConfig.chainIdHex }],
      })
    } catch (switchError) {
      const config = {
        chainId: networkConfig.chainIdHex,
        chainName: networkConfig.name,
        rpcUrls: [networkConfig.rpcUrl],
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

  const getExplorerUrl = useMemo(() => {
    const url = chainsConfig[appChainId]?.blockExplorerUrls[0]
    return (hash: string) => {
      const type = hash.length > 42 ? 'tx' : 'address'
      return `${url}${type}/${hash}`
    }
  }, [appChainId])

  const value = {
    // true when wallet is connected to same network as the dapp
    isAppConnected,
    isWalletConnected,
    isWalletNetworkSupported,
    appChainId,
    wallet,
    walletChainId,
    address,
    readOnlyAppProvider,
    web3Provider,
    getExplorerUrl,
    connectWallet,
    disconnectWallet,
    pushNetwork,
    setAppChainId: setAppChainId,
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
