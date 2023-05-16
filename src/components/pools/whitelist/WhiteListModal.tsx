import { useState } from 'react'
import styled from 'styled-components'

import { Modal as BaseModal } from '@/src/components/common/Modal'
import AddressesWhiteList, {
  addInitialAddressesWhiteListValues,
} from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
import {
  AddressWhiteListProps,
  AddressesWhiteListAmountFormat,
  AddressesWhiteListStep,
} from '@/src/components/pools/whitelist/addresses/types'
import NftWhiteList from '@/src/components/pools/whitelist/nft/NftWhiteList'
import { NftType } from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { Privacy } from '@/src/constants/pool'
import { NftCollectionRulesProps } from '@/src/hooks/aelin/useAelinCreatePool'
import { useNftCreationState } from '@/src/providers/nftCreationState'

const Modal = styled(BaseModal)`
  .modalCard {
    padding-left: 60px;
    padding-right: 60px;
  }
`

type WhiteListType = {
  currentAmountFormat: AddressesWhiteListAmountFormat | undefined
  poolPrivacy: Privacy | undefined
  currentList: AddressWhiteListProps[]
  onClose: () => void
  onConfirm: (
    whitelist: AddressWhiteListProps[] | NftCollectionRulesProps[],
    type: NftType | string,
    amountFormat?: AddressesWhiteListAmountFormat,
  ) => void
  withMerkleTree: boolean | undefined
}

const WhiteListModal = ({
  currentAmountFormat,
  currentList,
  onClose,
  onConfirm,
  poolPrivacy,
}: WhiteListType) => {
  const [addressesWhiteList] = useState(
    currentList.length ? currentList : addInitialAddressesWhiteListValues(),
  )
  const [addressesWhiteListStep, setAddressesWhiteListStep] = useState(
    currentAmountFormat ? AddressesWhiteListStep.addresses : AddressesWhiteListStep.format,
  )
  const [addressesWhiteListAmountFormat, setAddressesWhiteListAmountFormat] = useState(
    currentAmountFormat ?? AddressesWhiteListAmountFormat.decimal,
  )

  const { dispatch, nftWhiteListState } = useNftCreationState()

  if (!poolPrivacy) return null

  return (
    <Modal onClose={onClose} showCancelButton={false} size="794px" title="Allowlist">
      {poolPrivacy === Privacy.PRIVATE && (
        <AddressesWhiteList
          amountFormat={addressesWhiteListAmountFormat}
          currentStep={addressesWhiteListStep}
          list={addressesWhiteList}
          onClose={onClose}
          onConfirm={onConfirm}
          setAmountFormat={setAddressesWhiteListAmountFormat}
          setCurrentStep={setAddressesWhiteListStep}
        />
      )}
      {poolPrivacy === Privacy.NFT && (
        <NftWhiteList
          dispatch={dispatch}
          nftWhiteListState={nftWhiteListState}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      )}
    </Modal>
  )
}

export default WhiteListModal
