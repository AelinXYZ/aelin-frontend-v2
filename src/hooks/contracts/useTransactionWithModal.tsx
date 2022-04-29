import { useCallback, useState } from 'react'

import { Contract, ContractReceipt } from '@ethersproject/contracts'
import Wei, { wei } from '@synthetixio/wei'

import useTransaction from './useTransaction'
import ConfirmTransactionModal from '@/src/components/pools/common/ConfirmTransactionModal'
import { ZERO_BN } from '@/src/constants/misc'
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
  const [transactionParams, setTransactionParams] = useState<Params | null>(null)
  const [gasLimitEstimate, setGasLimitEstimate] = useState<Wei | null>(null)
  const [estimateError, setEstimateError] = useState<boolean>(false)

  const [gasPrice, setGasPrice] = useState<Wei | null>(null)

  const modalProps = useCallback(
    (
      modalTitle: string,
      onComplete: (receipt: ContractReceipt) => void,
      onError: (err: any) => void,
    ) => {
      return {
        disableButton: isSubmitting,
        gasLimitEstimate: gasLimitEstimate,
        onClose: () => setShowModalTransaction(false),
        onSubmit: async () => {
          if (transactionParams === null) throw new Error('Missing tx params')

          setIsSubmitting(true)

          const txOptions = {
            gasPrice: gasPrice && gasPrice.gt(wei(0)) ? gasPrice.toBN() : undefined,
            gasLimit:
              gasLimitEstimate && gasLimitEstimate.gt(wei(0))
                ? getGasEstimateWithBuffer(gasLimitEstimate)?.toBN()
                : undefined,
          }

          try {
            const receipt = await execute(transactionParams, txOptions)
            if (receipt) {
              onComplete(receipt)
              setTransactionParams(null)
            }
            setIsSubmitting(false)
          } catch (error) {
            onError(error)
            setIsSubmitting(false)
            setTransactionParams(null)
          }
        },
        setGasPrice,
        title: modalTitle,
      }
    },
    [execute, gasLimitEstimate, gasPrice, isSubmitting, transactionParams],
  )

  const _estimate = useCallback(
    async (params: Params) => {
      setIsSubmitting(true)
      setTransactionParams(params)
      setEstimateError(false)
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

  const getModalTransaction = useCallback(
    (modalTitle, onComplete: (receipt: ContractReceipt) => void, onError: (err: any) => void) => {
      return showModalTransaction ? (
        <ConfirmTransactionModal {...modalProps(modalTitle, onComplete, onError)} />
      ) : null
    },
    [modalProps, showModalTransaction],
  )

  return { getModalTransaction, setShowModalTransaction, estimate: _estimate, estimateError }
}
