import { useCallback } from 'react'

import { Contract, ContractTransaction } from '@ethersproject/contracts'

import { AppContractInfo } from '@/src/constants/contracts'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { TransactionError } from '@/src/utils/TransactionError'

export type QueryOptions = {
  refetchInterval: number
}

export default function useTransaction<
  MyContract extends Contract,
  Method extends keyof MyContract,
  Params extends Parameters<MyContract[Method]>,
>(contractInfo: AppContractInfo, method: Method) {
  const { appChainId, getExplorerUrl, isAppConnected, web3Provider } = useWeb3Connection()

  return useCallback(
    async (...params: Params) => {
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

      const contract = new Contract(
        contractInfo.address[appChainId],
        contractInfo.abi,
        signer,
      ) as MyContract

      let tx: ContractTransaction
      try {
        console.info('Please sign the transaction.')
        tx = await contract[method](...params)
        console.info(getExplorerUrl(tx.hash), 'Awaiting tx execution')
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
        return receipt
      } catch (e: any) {
        const error = new TransactionError(
          e.data?.message || e.message || 'Unable to decode revert reason',
          e.data?.code || e.code,
          e.data,
        )
        console.error('Transaction error', error.message)
        return null
      }
    },
    [
      web3Provider,
      isAppConnected,
      contractInfo.address,
      contractInfo.abi,
      appChainId,
      method,
      getExplorerUrl,
    ],
  )
}
