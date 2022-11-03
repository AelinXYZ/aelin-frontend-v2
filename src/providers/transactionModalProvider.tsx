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

type GasEstimate = {
  l1Gas: BigNumber
  l2Gas?: BigNumber
}

type ModalConfig = {
  /** estimate tx function */
  estimate: () => Promise<GasEstimate | null>
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
  const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null)
  const [gasPrice, setGasPrice] = useState<Eip1559GasPrice | Wei | null>(null)

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

  const txGasOptions: GasOptions = useMemo(() => {
    if (gasPrice && gasPrice instanceof Wei) {
      return {
        gasPrice: gasPrice?.gt(wei(0)) ? gasPrice.toBN() : undefined,
        gasLimit: getGasEstimateWithBuffer(gasLimitEstimate),
      }
    }
    return {
      maxFeePerGas: gasPrice?.maxFeePerGas.gt(wei(0)) ? gasPrice.maxFeePerGas.toBN() : undefined,
      maxPriorityFeePerGas: gasPrice?.maxPriorityFeePerGas.toBN(),
      gasLimit: getGasEstimateWithBuffer(gasLimitEstimate),
    }
  }, [gasLimitEstimate, gasPrice])

  const modalProps: ModalTransactionProps | null = useMemo(
    () =>
      modalConfig && {
        disableButton: isSubmitting,
        gasLimitEstimate,
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
    [gasLimitEstimate, isSubmitting, txGasOptions, modalConfig],
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
        modalConfig.estimate().then((estimate) => {
          if (estimate)
            setGasLimitEstimate({
              l1: wei(estimate.l1Gas, 0),
              l2: estimate.l2Gas ? wei(estimate.l2Gas, 0) : undefined,
            })
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
