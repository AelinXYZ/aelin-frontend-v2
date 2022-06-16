import React, { useState } from 'react'
import styled from 'styled-components'

import Wei from '@synthetixio/wei'

import GasSelector from '@/src/components/aelin/GasSelector'
import { Modal, ModalButtonCSS, ModalLine, ModalText } from '@/src/components/common/Modal'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { Eip1559GasPrice, GasLimitEstimate } from '@/types/utils'

const Button = styled(ButtonGradient)`
  ${ModalButtonCSS}
`

export type ModalTransactionProps = {
  disableButton: boolean
  gasLimitEstimate: GasLimitEstimate
  onSubmit: () => void
  setGasPrice: (gasPrice: Wei | Eip1559GasPrice) => void
  onClose: () => void
  title: string
  subTitle?: string
}

const ConfirmTransactionModal = ({
  disableButton,
  gasLimitEstimate,
  onClose,
  onSubmit,
  setGasPrice,
  subTitle,
  title,
}: ModalTransactionProps) => {
  const [loadingGas, setLoadingGas] = useState(true)
  const { isWalletConnected } = useWeb3Connection()
  if (!isWalletConnected) return null
  return (
    <Modal onClose={onClose} title="Confirm transaction">
      <ModalText>{title}</ModalText>
      {!!subTitle && <ModalText>{subTitle}</ModalText>}
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
