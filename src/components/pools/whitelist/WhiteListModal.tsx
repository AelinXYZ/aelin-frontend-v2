import { useReducer, useState } from 'react'
import styled from 'styled-components'

import { Modal as BaseModal } from '@/src/components/common/Modal'
import { WhiteListTab, WhiteListTabs } from '@/src/components/pools/whitelist/WhiteListTabs'
import AddressesWhiteList, {
  AddressWhitelistProps,
  initialWhitelistValues,
} from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
import NftWhiteList from '@/src/components/pools/whitelist/nft/NftWhiteList'
import {
  initialState,
  nftWhiteListReducer,
} from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'

const Modal = styled(BaseModal)`
  .modalCard {
    padding-left: 60px;
    padding-right: 60px;
  }
`

const WhiteListModal = ({
  currentList,
  onClose,
  onConfirm,
}: {
  currentList: AddressWhitelistProps[]
  onClose: () => void
  onConfirm: (whitelist: AddressWhitelistProps[]) => void
}) => {
  const [activeTab, setActiveTab] = useState(WhiteListTab.Addresses)

  const [addressesWhiteListError, setAddressesWhiteListError] = useState<boolean>(false)
  const [addressesWhiteList, setAddressesWhiteList] = useState(
    currentList.length ? currentList : initialWhitelistValues,
  )

  const [nftWhiteListState, dispatch] = useReducer(nftWhiteListReducer, initialState)

  return (
    <Modal onClose={onClose} size="794px" title="Whitelist">
      <WhiteListTabs
        active={activeTab}
        onTabClick={setActiveTab}
        tabs={[WhiteListTab.Addresses, WhiteListTab.Nft]}
      >
        {activeTab === WhiteListTab.Addresses && (
          <AddressesWhiteList
            error={addressesWhiteListError}
            list={addressesWhiteList}
            onClose={onClose}
            onConfirm={onConfirm}
            setError={setAddressesWhiteListError}
            setList={setAddressesWhiteList}
          ></AddressesWhiteList>
        )}
        {activeTab === WhiteListTab.Nft && (
          <NftWhiteList
            dispatch={dispatch}
            nftWhiteListState={nftWhiteListState}
            onClose={onClose}
          ></NftWhiteList>
        )}
      </WhiteListTabs>
    </Modal>
  )
}

export default WhiteListModal
