import { useCallback } from 'react'

import { Contract, ContractTransaction, Overrides } from '@ethersproject/contracts'
import { serialize } from '@ethersproject/transactions'
import { wei } from '@synthetixio/wei'
import { toast } from 'react-hot-toast'

import { notify } from '@/src/components/toast/Toast'
import { FAILED_TYPE, SUCCESS_TYPE, WAITING_TYPE } from '@/src/components/toast/types'
import { Chains } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { TransactionError } from '@/src/utils/TransactionError'
import contractCall from '@/src/utils/contractCall'

const optimismOracleContractAddress = '0x420000000000000000000000000000000000000F'

export type QueryOptions = {
  refetchInterval: number
}

export default function useTransaction<
  MyContract extends Contract,
  Method extends keyof MyContract,
  Params extends Parameters<MyContract[Method]>,
>(address: string, abi: any[], method: Method) {
  const { appChainId, getExplorerUrl, isAppConnected, web3Provider } = useWeb3Connection()

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
        toast.dismiss()

        const error = new TransactionError(
          e.error?.message ||
            e.reason ||
            e.data?.message ||
            e.message ||
            'Unable to decode revert reason',
          e.data?.code || e.code,
          e.data,
        )
        if (error.code === 4001) {
          notify({ type: FAILED_TYPE, message: 'User denied signature' })
          return null
        }
        console.error('Transaction error', error.message)

        notify({ type: FAILED_TYPE, message: error.message })

        return null
      }

      try {
        const receipt = await tx.wait()
        console.log(getExplorerUrl(tx.hash), 'Transaction success')

        toast.dismiss()
        notify({ type: SUCCESS_TYPE, explorerUrl: getExplorerUrl(tx.hash) })

        return receipt
      } catch (e: any) {
        toast.dismiss()

        const error = new TransactionError(
          e.error?.message ||
            e.reason ||
            e.data?.message ||
            e.message ||
            'Unable to decode revert reason',
          e.data?.code || e.code,
          e.data,
        )

        notify({ type: FAILED_TYPE, explorerUrl: getExplorerUrl(tx.hash) })

        console.error('Transaction error', error.message)
        return null
      }
    },
    [web3Provider, isAppConnected, address, abi, method, getExplorerUrl],
  )

  const estimate = useCallback(
    async (params?: Params) => {
      const signer = web3Provider?.getSigner()
      if (!signer || !web3Provider) {
        notify({ type: FAILED_TYPE, message: 'There is no provider' })
        console.error('Transaction failed, there is no provider')
        return null
      }

      if (!isAppConnected) {
        console.error('App is not connected')
        return null
      }

      const _params = Array.isArray(params) ? params : []

      const contract = new Contract(address, abi, signer) as MyContract
      try {
        console.info('Calculating transaction gas.')
        let estimate = {}
        if (appChainId === Chains.optimism) {
          const txReq = await contract.populateTransaction[method as string](..._params)
          const tx = await signer.populateTransaction(txReq)

          const l1Fee = await contractCall(
            optimismOracleContractAddress as string,
            ['function getL1Fee(bytes _data) view returns (uint256)'],
            web3Provider,
            'getL1Fee',
            [serialize(tx)],
          )
          estimate = { l1Fee: wei(l1Fee) }
        }
        const gasLimit = await contract.estimateGas[method as string](..._params)
        return {
          gasLimit: wei(gasLimit, 0),
          ...estimate,
        }
      } catch (e: any) {
        console.error('Gas estimate failed', e.message)
        return { gasLimit: wei(0) }
      }
    },
    [abi, address, isAppConnected, method, web3Provider, appChainId],
  )

  return { execute, estimate }
}
