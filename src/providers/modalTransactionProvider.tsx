import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import Wei, { wei } from '@synthetixio/wei'

import ConfirmTransactionModal, {
  ModalTransactionProps,
} from '@/src/components/pools/common/ConfirmTransactionModal'
import { getGasEstimateWithBuffer } from '@/src/utils/gasUtils'
import { GasLimitEstimate } from '@/types/utils'

const ModalTransactionContext = createContext<ModalTransactionContext | undefined>(undefined)

export type GasOptions = {
  gasPrice: BigNumber | undefined
  gasLimit: BigNumber | undefined
}

export type ModalTransactionContext = {
  setConfigAndOpenModal: (cfg: ModalConfig) => void
  isSubmitting: boolean
}

type Props = {
  children: ReactNode
}

type ModalConfig = {
  /** estimate tx function */
  estimate: () => Promise<BigNumber | null>
  /** Action on modal submit (expected: execute transaction with gas calculated on estimate fn) */
  onConfirm: ({ gasLimit, gasPrice }: GasOptions) => Promise<void>
  /** The modal title */
  title: string
}

export default function TransactionModalProvider({ children }: Props) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null)
  const [gasPrice, setGasPrice] = useState<Wei | null>(null)

  const [showModalTransaction, setShowModalTransaction] = useState<boolean>(false)

  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null)

  const cleanState = () => {
    setGasLimitEstimate(null)
    setIsSubmitting(false)
    setShowModalTransaction(false)
    setGasPrice(null)
    setGasLimitEstimate(null)
    setModalConfig(null)
  }

  const txGasOptions: GasOptions = useMemo(
    () => ({
      gasPrice: gasPrice && gasPrice.gt(wei(0)) ? gasPrice.toBN() : undefined,
      gasLimit:
        gasLimitEstimate && gasLimitEstimate.gt(wei(0))
          ? getGasEstimateWithBuffer(gasLimitEstimate)?.toBN()
          : undefined,
    }),
    [gasLimitEstimate, gasPrice],
  )

  const modalProps: ModalTransactionProps | null = useMemo(
    () =>
      modalConfig && {
        disableButton: isSubmitting,
        gasLimitEstimate: gasLimitEstimate,
        onClose: () => {
          setShowModalTransaction(false)
          cleanState()
        },
        onSubmit: async () => {
          setIsSubmitting(true)
          setShowModalTransaction(false)
          try {
            await modalConfig.onConfirm(txGasOptions)
          } catch (e) {
            console.log(e)
          }
          cleanState()
        },
        setGasPrice,
        title: modalConfig.title,
      },
    [gasLimitEstimate, isSubmitting, txGasOptions, modalConfig],
  )

  const setConfigAndOpenModal = useCallback(({ estimate, onConfirm, title }: ModalConfig) => {
    // open modal with loading (need to finish estimate call)
    setIsSubmitting(true)
    setShowModalTransaction(true)

    setModalConfig({ estimate, title, onConfirm })
  }, [])

  useEffect(() => {
    // when estimate is setted, is called too
    if (modalConfig && modalConfig.estimate) {
      try {
        modalConfig.estimate().then((estimate) => {
          setGasLimitEstimate(wei(estimate, 0))
          setIsSubmitting(false)
        })
      } catch (e) {
        console.log(e)
        setGasLimitEstimate(null)
        setIsSubmitting(false)
      }
    }
  }, [modalConfig])

  const values = {
    setConfigAndOpenModal,
    isSubmitting,
  }

  return (
    <ModalTransactionContext.Provider value={values}>
      {children}
      {showModalTransaction && modalProps && <ConfirmTransactionModal {...modalProps} />}
    </ModalTransactionContext.Provider>
  )
}

export function useTransactionModal() {
  const context = useContext(ModalTransactionContext)
  if (!context) {
    throw new Error('Error on modal tx context')
  }
  return context
}
