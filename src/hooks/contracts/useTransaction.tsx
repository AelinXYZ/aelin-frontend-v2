import { useCallback, useMemo } from 'react'

import { Contract, ContractTransaction, Overrides } from '@ethersproject/contracts'

import { notify } from '@/src/components/toast/Toast'
import { ERROR_TYPE, SUCCESS_TYPE, WAITING_TYPE } from '@/src/components/toast/types'
import { ZERO_BN } from '@/src/constants/misc'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { TransactionError } from '@/src/utils/TransactionError'

export type QueryOptions = {
  refetchInterval: number
}

export default function useTransaction<
  MyContract extends Contract,
  Method extends keyof MyContract,
  Params extends Parameters<MyContract[Method]>,
>(address: string, abi: any[], method: Method) {
  const { getExplorerUrl, isAppConnected, web3Provider } = useWeb3Connection()

  const execute = useCallback(
    async (params?: Params, options?: Overrides) => {
      const signer = web3Provider?.getSigner()
      if (!signer) {
        // TODO replace console with some notification or toast
        console.error('Transaction failed, there is no provider')
        return null
      }

      if (!isAppConnected) {
        console.error('App is not connected')
        return null
      }

      const contract = new Contract(address, abi, signer) as MyContract

      const _params = Array.isArray(params) ? params : []

      let tx: ContractTransaction
      try {
        console.info('Please sign the transaction.')
        tx = await contract[method](..._params, { ...options })
        console.info(getExplorerUrl(tx.hash), 'Awaiting tx execution')

        notify({ type: WAITING_TYPE, explorerUrl: getExplorerUrl(tx.hash) })
      } catch (e: any) {
        const error = new TransactionError(
          e.data?.message || e.message || 'Unable to decode revert reason',
          e.data?.code || e.code,
          e.data,
        )
        if (error.code === 4001) {
          console.warn('User denied signature')
          return null
        }
        console.error('Transaction error', error.message)
        return null
      }

      try {
        const receipt = await tx.wait()
        console.log(getExplorerUrl(tx.hash), 'Transaction success')
        notify({ type: SUCCESS_TYPE, explorerUrl: getExplorerUrl(tx.hash) })

        return receipt
      } catch (e: any) {
        const error = new TransactionError(
          e.data?.message || e.message || 'Unable to decode revert reason',
          e.data?.code || e.code,
          e.data,
        )
        notify({ type: ERROR_TYPE, explorerUrl: getExplorerUrl(tx.hash) })
        console.error('Transaction error', error.message)
        return null
      }
    },
    [web3Provider, isAppConnected, address, abi, method, getExplorerUrl],
  )

  const estimate = useCallback(
    async (params: Params) => {
      const signer = web3Provider?.getSigner()
      if (!signer) {
        // TODO replace console with some notification or toast
        console.error('Transaction failed, there is no provider')
        return null
      }

      if (!isAppConnected) {
        console.error('App is not connected')
        return null
      }

      const contract = new Contract(address, abi, signer) as MyContract
      try {
        console.info('Calculating transaction gas.')
        return await contract.estimateGas[method as string](...params)
      } catch (e: any) {
        return ZERO_BN
      }
    },
    [abi, address, isAppConnected, method, web3Provider],
  )

  return useMemo(() => {
    return { execute, estimate }
  }, [execute, estimate])
}
