import { useEffect, useState } from 'react'

import * as optimismSDK from '@eth-optimism/sdk'
import { Web3Provider } from '@ethersproject/providers'
import { Wallet } from 'bnc-onboard/dist/src/interfaces'

import { Chains } from '../constants/chains'

export type Provider = Web3Provider | optimismSDK.L2Provider<Web3Provider>

export function useWeb3Provider(wallet: Wallet | null, chainId: number | null) {
  const [web3Provider, setWeb3Provider] = useState<Provider | null>(null)

  useEffect(() => {
    if (wallet?.provider) {
      if (chainId === Chains.optimism) {
        setWeb3Provider(optimismSDK.asL2Provider(new Web3Provider(wallet.provider)))
      } else {
        setWeb3Provider(new Web3Provider(wallet.provider))
      }
    }
  }, [wallet, chainId])

  return web3Provider
}
