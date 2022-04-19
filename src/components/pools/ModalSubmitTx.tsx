import React, { useState } from 'react'
import styled from 'styled-components'

import Wei from '@synthetixio/wei'

import GasSelector from '@/src/components/aelin/GasSelector'
import { Modal } from '@/src/components/common/Modal'
import { ButtonPrimary } from '@/src/components/pureStyledComponents/buttons/Button'
import { GasLimitEstimate, GasPrices } from '@/types/utils'

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.4;
  margin: 0 0 50px;
  max-width: 100%;
  padding: 0 20px;
  text-align: center;
  width: 690px;
`

const ModalSubmitTx = ({
  disableButton,
  gasLimitEstimate,
  onClose,
  onSubmit,
  setGasPrice,
  showModal,
  title,
}: {
  disableButton: boolean
  gasLimitEstimate: GasLimitEstimate
  onSubmit: () => void
  setGasPrice: (gasPrice: Wei) => void
  onClose: () => void
  showModal: boolean
  title: string
}) => {
  if (!showModal) return null
  return (
    <Modal onClose={onClose} title="Confirm transaction">
      <Description>{title}</Description>
      <GasSelector gasLimitEstimate={gasLimitEstimate} onChange={setGasPrice} />
      <br />
      <ButtonPrimary disabled={disableButton} onClick={onSubmit}>
        Submit
      </ButtonPrimary>
      <br />
    </Modal>
  )
}

export default ModalSubmitTx
