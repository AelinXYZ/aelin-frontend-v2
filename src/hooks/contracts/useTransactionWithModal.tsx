import { useCallback, useEffect, useState } from 'react'

import { Contract, ContractReceipt } from '@ethersproject/contracts'
import Wei, { wei } from '@synthetixio/wei'

import useTransaction from './useTransaction'
import ConfirmTransactionModal from '@/src/components/pools/common/ConfirmTransactionModal'
import { getGasEstimateWithBuffer } from '@/src/utils/gasUtils'

export type QueryOptions = {
  refetchInterval: number
}

export default function useTransactionWithModal<
  MyContract extends Contract,
  Method extends keyof MyContract,
  Params extends Parameters<MyContract[Method]>,
>(address: string, abi: any[], method: Method) {
  const { estimate, execute } = useTransaction(address, abi, method as keyof Contract)

  const [showModalTransaction, setShowModalTransaction] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [transactionParams, setTransactionParams] = useState<Params | undefined>(undefined)
  const [gasLimitEstimate, setGasLimitEstimate] = useState<Wei | null>(null)
  const [estimateError, setEstimateError] = useState<boolean>(false)

  const [gasPrice, setGasPrice] = useState<Wei | null>(null)

  const modalProps = useCallback(
    (
      modalTitle: string,
      onComplete: (receipt: ContractReceipt) => void,
      onError?: (err: any) => void,
    ) => {
      return {
        disableButton: isSubmitting,
        gasLimitEstimate: gasLimitEstimate,
        onClose: () => setShowModalTransaction(false),
        onSubmit: async () => {
          setIsSubmitting(true)

          const txOptions = {
            gasPrice: gasPrice && gasPrice.gt(wei(0)) ? gasPrice.toBN() : undefined,
            gasLimit:
              gasLimitEstimate && gasLimitEstimate.gt(wei(0))
                ? getGasEstimateWithBuffer(gasLimitEstimate)?.toBN()
                : undefined,
          }

          setShowModalTransaction(false)
          try {
            const receipt = await execute(transactionParams, txOptions)
            if (receipt) {
              onComplete(receipt)
              setTransactionParams(undefined)
            }
            setIsSubmitting(false)
          } catch (error) {
            if (onError) {
              onError(error)
            }
            console.log(error)
            setIsSubmitting(false)
            setTransactionParams(undefined)
          }
        },
        setGasPrice,
        title: modalTitle,
      }
    },
    [execute, gasLimitEstimate, gasPrice, isSubmitting, transactionParams],
  )

  const _estimate = useCallback(
    async (params?: Params) => {
      setIsSubmitting(true)
      setTransactionParams(params)
      setEstimateError(false)
      setShowModalTransaction(true)
      try {
        const estimateGas = await estimate(params)
        setGasLimitEstimate(wei(estimateGas, 0))
        setIsSubmitting(false)
        return estimateGas
      } catch (e) {
        console.log(e)
        setGasLimitEstimate(null)
        setEstimateError(true)
        setIsSubmitting(false)
        return null
      }
    },
    [estimate],
  )

  useEffect(() => {
    return () => {
      setTransactionParams(undefined)
      setGasLimitEstimate(null)
      setEstimateError(false)
      setIsSubmitting(false)
      setShowModalTransaction(false)
    }
  }, [])

  const getModalTransaction = useCallback(
    (modalTitle, onComplete: (receipt: ContractReceipt) => void, onError?: (err: any) => void) => {
      return showModalTransaction ? (
        <ConfirmTransactionModal {...modalProps(modalTitle, onComplete, onError)} />
      ) : null
    },
    [modalProps, showModalTransaction],
  )

  return {
    getModalTransaction,
    setShowModalTransaction,
    estimate: _estimate,
    estimateError,
    isSubmitting,
  }
}
