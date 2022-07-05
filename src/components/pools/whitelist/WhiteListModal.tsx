import { useReducer, useState } from 'react'
import styled from 'styled-components'

import { Modal as BaseModal } from '@/src/components/common/Modal'
import { WhiteListTab, WhiteListTabs } from '@/src/components/pools/whitelist/WhiteListTabs'
import AddressesWhiteList, {
  AddressWhitelistProps,
  initialAddressesWhitelistValues,
} from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
import NftWhiteList, { NftWhiteListData } from '@/src/components/pools/whitelist/nft/NftWhiteList'
import {
  NftWhiteListStep,
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
  curentNftWhitelist,
  currentAddressesWhitelist,
  investmentTokenDecimals,
  onAddressesWhitelistSave,
  onClose,
  onNftWhitelistSave,
}: {
  currentAddressesWhitelist: AddressWhitelistProps[]
  curentNftWhitelist?: NftWhiteListData
  investmentTokenDecimals: number
  onClose: () => void
  onAddressesWhitelistSave: (addressesWhitelist: AddressWhitelistProps[]) => void
  onNftWhitelistSave: (nftWhitelist: NftWhiteListData) => void
}) => {
  const [activeTab, setActiveTab] = useState(WhiteListTab.Addresses)

  const [addressesWhiteList, setAddressesWhiteList] = useState(
    currentAddressesWhitelist.length ? currentAddressesWhitelist : initialAddressesWhitelistValues,
  )

  const [nftWhiteListState, dispatch] = useReducer(
    nftWhiteListReducer,
    curentNftWhitelist
      ? { ...curentNftWhitelist, currentStep: NftWhiteListStep.nftCollection }
      : initialState,
  )

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
            onSave={onAddressesWhitelistSave}
            setList={setAddressesWhiteList}
          ></AddressesWhiteList>
        )}
        {activeTab === WhiteListTab.Nft && (
          <NftWhiteList
            dispatch={dispatch}
            nftWhiteListState={nftWhiteListState}
            onClose={onClose}
            onSave={onNftWhitelistSave}
          ></NftWhiteList>
        )}
      </WhiteListTabs>
    </Modal>
  )
}

export default WhiteListModal
