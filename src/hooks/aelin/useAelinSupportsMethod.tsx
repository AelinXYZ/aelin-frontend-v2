//eslint-disable @typescript-eslint/no-explicit-any
import { useCallback, useEffect, useState } from 'react'

import * as optimismSDK from '@eth-optimism/sdk'
import { Signer } from '@ethersproject/abstract-signer'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'

import { ParsedAelinPool } from './useAelinPool'
import aelinDealABI from '@/src/abis/AelinDeal.json'
import aelinPoolABI from '@/src/abis/AelinPool.json'
import aelinUpfrontDealABI from '@/src/abis/AelinUpfrontDeal.json'
import { Chains, ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { AelinUpfrontDeal } from '@/types/typechain'
import { AelinPool } from '@/types/typechain'
import { AelinDeal } from '@/types/typechain'

export function useAelinPoolSupportsMethod<
  MethodName extends keyof AelinPool['functions'],
  Params extends Parameters<AelinPool[MethodName]>,
>(pool: ParsedAelinPool, methodName: MethodName, params?: Params) {
  const [supportsMethod, setSupportsMethod] = useState<boolean>()
  const provider = new JsonRpcProvider(getNetworkConfig(pool.chainId).rpcUrl)

  const isMethodSupported = useSupportMethod(provider, pool.address, pool.chainId, aelinPoolABI)

  useEffect(() => {
    isMethodSupported(methodName, params).then(setSupportsMethod)
  }, [isMethodSupported, methodName, params])

  return supportsMethod
}

export function useAelinUpFrontDealSupportsMethod<
  MethodName extends keyof AelinUpfrontDeal['functions'],
  Params extends Parameters<AelinUpfrontDeal[MethodName]>,
>(pool: ParsedAelinPool, methodName: MethodName, params?: Params) {
  const [supportsMethod, setSupportsMethod] = useState<boolean>()
  const provider = new JsonRpcProvider(getNetworkConfig(pool.chainId).rpcUrl)

  const isMethodSupported = useSupportMethod(
    provider,
    pool.address,
    pool.chainId,
    aelinUpfrontDealABI,
  )

  useEffect(() => {
    isMethodSupported(methodName, params).then(setSupportsMethod)
  }, [isMethodSupported, methodName, params])

  return supportsMethod
}

export function useAelinDealSupportsMethod<
  MethodName extends keyof AelinDeal['functions'],
  Params extends Parameters<AelinDeal[MethodName]>,
>(pool: ParsedAelinPool, methodName: MethodName, params?: Params) {
  const [supportsMethod, setSupportsMethod] = useState<boolean>()
  const provider = new JsonRpcProvider(getNetworkConfig(pool.chainId).rpcUrl)

  const isMethodSupported = useSupportMethod(
    provider,
    pool.dealAddress || ZERO_ADDRESS,
    pool.chainId,
    aelinDealABI,
  )

  useEffect(() => {
    isMethodSupported(methodName, params).then(setSupportsMethod)
  }, [isMethodSupported, methodName, params])

  return supportsMethod
}

function useSupportMethod(
  provider: JsonRpcProvider,
  address: string,
  chainId: ChainsValues,
  abi: any[],
) {
  return useCallback(
    async (method: string, params: any) => {
      const signer = provider.getSigner(ZERO_ADDRESS) as Signer
      const contract = new Contract(address, abi, signer) as Contract
      const _params = Array.isArray(params) ? params : []

      try {
        if (chainId === Chains.optimism) {
          const txReq = await contract.populateTransaction[method](..._params)
          const tx = await signer.populateTransaction(txReq)

          const l2Gas = await (provider as optimismSDK.L2Provider<Web3Provider>).estimateGas(tx)

          return l2Gas.gt(ZERO_BN)
        }
        const l1Gas = await contract.estimateGas[method](..._params)
        return l1Gas.gt(ZERO_BN)
      } catch (e: any) {
        console.error('Error while verifying if method is supported')
        return false
      }
    },
    [address, chainId, abi, provider],
  )
}
