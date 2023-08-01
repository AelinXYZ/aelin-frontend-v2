import coinbaseModule from '@web3-onboard/coinbase'
import gnosisModule from '@web3-onboard/gnosis'
import injectedModule from '@web3-onboard/injected-wallets'
import ledgerModule from '@web3-onboard/ledger'
import { init } from '@web3-onboard/react'
import trezorModule from '@web3-onboard/trezor'
import walletConnectModule from '@web3-onboard/walletconnect'

import { AelinIconString, AelinLogoString } from '../components/assets/Logo'
import env from '@/config/env'
import { Chains, chainsConfig } from '@/src/constants/chains'

const EMAIL_CONTACT = env.NEXT_PUBLIC_EMAIL_CONTACT as string
const APP_URL = env.NEXT_PUBLIC_APP_URL as string
const APP_NAME = env.NEXT_PUBLIC_APP_NAME as string

const injected = injectedModule()
const gnosis = gnosisModule()
const walletConnect = walletConnectModule()
const coinbase = coinbaseModule()
// @ts-ignore
const ledger = ledgerModule({ projectId: WALLET_CONNECT_PROJECT_ID, walletConnectVersion: 2 })
const trezor = trezorModule({
  email: EMAIL_CONTACT,
  appUrl: APP_URL,
})

init({
  wallets: [injected, coinbase, walletConnect, gnosis, trezor, ledger],
  chains: [
    {
      id: chainsConfig[Chains.mainnet].chainIdHex,
      token: chainsConfig[Chains.mainnet].nativeCurrency.name,
      label: chainsConfig[Chains.mainnet].name,
      rpcUrl: chainsConfig[Chains.mainnet].rpcUrl,
    },
    {
      id: chainsConfig[Chains.optimism].chainIdHex,
      token: chainsConfig[Chains.optimism].nativeCurrency.name,
      label: chainsConfig[Chains.optimism].name,
      rpcUrl: chainsConfig[Chains.optimism].rpcUrl,
    },
    {
      id: chainsConfig[Chains.arbitrum].chainIdHex,
      token: chainsConfig[Chains.arbitrum].nativeCurrency.name,
      label: chainsConfig[Chains.arbitrum].name,
      rpcUrl: chainsConfig[Chains.arbitrum].rpcUrl,
    },
    {
      id: chainsConfig[Chains.polygon].chainIdHex,
      token: chainsConfig[Chains.polygon].nativeCurrency.name,
      label: chainsConfig[Chains.polygon].name,
      rpcUrl: chainsConfig[Chains.polygon].rpcUrl,
    },
    {
      id: chainsConfig[Chains.goerli].chainIdHex,
      token: chainsConfig[Chains.goerli].nativeCurrency.name,
      label: chainsConfig[Chains.goerli].name,
      rpcUrl: chainsConfig[Chains.goerli].rpcUrl,
    },
    {
      id: chainsConfig[Chains.sepolia].chainIdHex,
      token: chainsConfig[Chains.sepolia].nativeCurrency.name,
      label: chainsConfig[Chains.sepolia].name,
      rpcUrl: chainsConfig[Chains.sepolia].rpcUrl,
    },
  ],
  appMetadata: {
    name: APP_NAME,
    icon: AelinIconString,
    logo: AelinLogoString,
    description:
      "A permissionless multi-chain protocol for capital raises and OTC deals. No need for VC's, Aelin decentralizes fundraising",
    recommendedInjectedWallets: [
      { name: 'Metamask', url: 'https://metamask.io' },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
      { name: 'WalletConnect', url: 'https://walletconnect.org/' },
      { name: 'Gnosis Safe', url: 'https://gnosis.safe/' },
      { name: 'Trezor', url: 'https://trezor.io/' },
      { name: 'Ledger', url: 'https://ledger.com/' },
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
  theme: 'dark',
})
