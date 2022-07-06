import { useReducer, useState } from 'react'
import styled from 'styled-components'

import { Modal as BaseModal } from '@/src/components/common/Modal'
import { WhiteListTab, WhiteListTabs } from '@/src/components/pools/whitelist/WhiteListTabs'
import AddressesWhiteList, {
  AddressWhitelistProps,
  initialAddressesWhitelistValues,
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
  investmentTokenDecimals,
  onClose,
  onConfirm,
}: {
  currentList: AddressWhitelistProps[]
  investmentTokenDecimals: number
  onClose: () => void
  onConfirm: (whitelist: AddressWhitelistProps[]) => void
}) => {
  const [activeTab, setActiveTab] = useState(WhiteListTab.Addresses)

  const [addressesWhiteList, setAddressesWhiteList] = useState(
    currentList.length ? currentList : initialAddressesWhitelistValues,
  )

  const [nftWhiteListState, dispatch] = useReducer(nftWhiteListReducer, initialState)

  return (
    <Modal onClose={onClose} showCancelButton={false} size="794px" title="Whitelist">
      <WhiteListTabs
        active={activeTab}
        onTabClick={setActiveTab}
        tabs={[WhiteListTab.Addresses, WhiteListTab.Nft]}
      >
        {activeTab === WhiteListTab.Addresses && (
          <AddressesWhiteList
            investmentTokenDecimals={investmentTokenDecimals}
            list={addressesWhiteList}
            onClose={onClose}
            onConfirm={onConfirm}
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
