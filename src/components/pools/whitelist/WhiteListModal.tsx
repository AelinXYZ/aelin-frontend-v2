import { useReducer, useState } from 'react'
import styled from 'styled-components'

import { Modal as BaseModal } from '@/src/components/common/Modal'
import AddressesWhiteList, {
  AddressWhitelistProps,
  initialAddressesWhitelistValues,
} from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
import NftWhiteList from '@/src/components/pools/whitelist/nft/NftWhiteList'
import {
  NftType,
  initialState,
  nftWhiteListReducer,
} from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { Privacy } from '@/src/constants/pool'
import { NftCollectionRulesProps } from '@/src/hooks/aelin/useAelinCreatePool'

const Modal = styled(BaseModal)`
  .modalCard {
    padding-left: 60px;
    padding-right: 60px;
  }
`

const WhiteListModal = ({
  currentList,
  investmentTokenDecimals,
  onClose,
  onConfirm,
  poolPrivacy,
}: {
  poolPrivacy: Privacy | undefined
  currentList: AddressWhitelistProps[]
  investmentTokenDecimals: number
  onClose: () => void
  onConfirm: (
    whitelist: AddressWhitelistProps[] | NftCollectionRulesProps[],
    type: NftType | string,
  ) => void
}) => {
  const [addressesWhiteList, setAddressesWhiteList] = useState(
    currentList.length ? currentList : initialAddressesWhitelistValues,
  )

  const [nftWhiteListState, dispatch] = useReducer(nftWhiteListReducer, initialState)

  if (!poolPrivacy) return null

  return (
    <Modal onClose={onClose} showCancelButton={false} size="794px" title="Allowlist">
      {poolPrivacy === Privacy.PRIVATE && (
        <AddressesWhiteList
          investmentTokenDecimals={investmentTokenDecimals}
          list={addressesWhiteList}
          onClose={onClose}
          onConfirm={onConfirm}
          setList={setAddressesWhiteList}
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
