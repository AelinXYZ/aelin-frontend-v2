import React, { useState } from 'react'
import styled from 'styled-components'

import Wei from '@synthetixio/wei'

import { Loading } from '../../common/Loading'
import GasSelector from '@/src/components/aelin/GasSelector'
import { Modal, ModalButtonCSS, ModalLine, ModalText } from '@/src/components/common/Modal'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { GasLimitEstimate } from '@/types/utils'

const Button = styled(GradientButton)`
  ${ModalButtonCSS}
`

export type ModalTransactionProps = {
  disableButton: boolean
  gasLimitEstimate: GasLimitEstimate
  onSubmit: () => void
  setGasPrice: (gasPrice: Wei) => void
  onClose: () => void
  title: string
}

const ConfirmTransactionModal = ({
  disableButton,
  gasLimitEstimate,
  onClose,
  onSubmit,
  setGasPrice,
  title,
}: ModalTransactionProps) => {
  const [loadingGas, setLoadingGas] = useState(true)
  const { isWalletConnected } = useWeb3Connection()
  if (!isWalletConnected) return null
  return (
    <Modal onClose={onClose} title="Confirm transaction">
      <ModalText>{title}</ModalText>
      <ModalLine />
      <GasSelector
        gasLimitEstimate={gasLimitEstimate}
        onChange={setGasPrice}
        setLoadingGas={setLoadingGas}
      />
      <Button disabled={disableButton || loadingGas} onClick={onSubmit}>
        Submit
      </Button>
    </Modal>
  )
}

export default ConfirmTransactionModal
