import { useEffect, useState } from 'react'

import * as optimismSDK from '@eth-optimism/sdk'
import { Web3Provider } from '@ethersproject/providers'
import type { WalletState } from '@web3-onboard/core'
import { Web3Provider as ZkSyncWeb3Provider } from 'zksync-web3'

import { Chains } from '../constants/chains'

export type Provider = Web3Provider | optimismSDK.L2Provider<Web3Provider> | ZkSyncWeb3Provider

export function useWeb3Provider(wallet: WalletState | null, chainId: number | null) {
  const [web3Provider, setWeb3Provider] = useState<Provider | null>(null)

  useEffect(() => {
    if (wallet?.provider) {
      if (chainId === Chains.optimism) {
        setWeb3Provider(optimismSDK.asL2Provider(new Web3Provider(wallet.provider)))
      } else if ((chainId === Chains.zkSync || chainId) === Chains.zkSyncTestnet) {
        setWeb3Provider(new ZkSyncWeb3Provider(wallet.provider))
      } else {
        setWeb3Provider(new Web3Provider(wallet.provider))
      }
    }
  }, [wallet, chainId])

  return web3Provider
}
