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
import { Eip1559GasPrice, GasLimitEstimate } from '@/types/utils'
const ModalTransactionContext = createContext<ModalTransactionContext | undefined>(undefined)

export type GasOptions = {
  gasPrice?: BigNumber
  gasLimit?: BigNumber
  maxFeePerGas?: BigNumber
  maxPriorityFeePerGas?: BigNumber
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
  estimate: () => Promise<GasLimitEstimate | null>
  /** Action on modal submit (expected: execute transaction with gas calculated on estimate fn) */
  onConfirm: ({ gasLimit, gasPrice }: GasOptions) => Promise<void>
  /** The modal title */
  title: string
  /** The modal subtitle */
  subTitle?: string
  /** The modal alert */
  alert?: string
}

export default function TransactionModalProvider({ children }: Props) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [gasEstimate, setGasEstimate] = useState<GasLimitEstimate | null>(null)
  const [gasPrice, setGasPrice] = useState<Eip1559GasPrice | Wei | null>(null)

  const [showModalTransaction, setShowModalTransaction] = useState<boolean>(false)

  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null)

  const cleanState = () => {
    setIsSubmitting(false)
    setShowModalTransaction(false)
    setGasPrice(null)
    setGasEstimate(null)
    setModalConfig(null)
  }

  const txGasOptions: GasOptions = useMemo(() => {
    const gasLimitWithBuffer = getGasEstimateWithBuffer(gasEstimate?.gasLimit ?? wei(0))
    if (gasPrice && gasPrice instanceof Wei) {
      return {
        gasPrice: gasPrice?.gt(wei(0)) ? gasPrice.toBN() : undefined,
        gasLimit: gasLimitWithBuffer,
      }
    }
    return {
      maxFeePerGas: gasPrice?.maxFeePerGas.gt(wei(0)) ? gasPrice.maxFeePerGas.toBN() : undefined,
      maxPriorityFeePerGas: gasPrice?.maxPriorityFeePerGas.toBN(),
      gasLimit: gasLimitWithBuffer,
    }
  }, [gasEstimate, gasPrice])

  const modalProps: ModalTransactionProps | null = useMemo(
    () =>
      modalConfig && {
        disableButton: isSubmitting,
        gasEstimate,
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
        subTitle: modalConfig.subTitle,
        alert: modalConfig.alert,
      },
    [gasEstimate, isSubmitting, txGasOptions, modalConfig],
  )

  const setConfigAndOpenModal = useCallback(
    ({ alert, estimate, onConfirm, subTitle, title }: ModalConfig) => {
      // open modal with loading (need to finish estimate call)
      setIsSubmitting(true)
      setShowModalTransaction(true)

      setModalConfig({ estimate, title, subTitle, alert, onConfirm })
    },
    [],
  )

  useEffect(() => {
    // when estimate is set, is called too
    if (modalConfig && modalConfig.estimate) {
      try {
        modalConfig.estimate().then((estimate: GasLimitEstimate | null) => {
          if (estimate) {
            setGasEstimate(estimate)
          }
          setIsSubmitting(false)
        })
      } catch (e) {
        console.log(e)
        setGasEstimate(null)
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
