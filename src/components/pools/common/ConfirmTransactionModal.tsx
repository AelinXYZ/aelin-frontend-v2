import React from 'react'
import styled from 'styled-components'

import Wei from '@synthetixio/wei'

import GasSelector from '@/src/components/aelin/GasSelector'
import { Modal, ModalButtonCSS, ModalLine, ModalText } from '@/src/components/common/Modal'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { GasLimitEstimate } from '@/types/utils'

const Button = styled(GradientButton)`
  ${ModalButtonCSS}
`

const ConfirmTransactionModal = ({
  disableButton,
  gasLimitEstimate,
  onClose,
  onSubmit,
  setGasPrice,
  title,
}: {
  disableButton: boolean
  gasLimitEstimate: GasLimitEstimate
  onSubmit: () => void
  setGasPrice: (gasPrice: Wei) => void
  onClose: () => void
  title: string
}) => {
  return (
    <Modal onClose={onClose} title="Confirm transaction">
      <ModalText>{title}</ModalText>
      <ModalLine />
      <GasSelector gasLimitEstimate={gasLimitEstimate} onChange={setGasPrice} />
      <Button disabled={disableButton} onClick={onSubmit}>
        Submit
      </Button>
    </Modal>
  )
}

export default ConfirmTransactionModal
