import { useState } from 'react'
import styled from 'styled-components'

import { Modal as BaseModal } from '@/src/components/common/Modal'
import AddressesWhiteList, {
  AddressWhitelistProps,
  initialWhitelistValues,
} from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
import NftWhiteList, { NftWhiteListStep } from '@/src/components/pools/whitelist/nft/NftWhiteList'
import { WhiteListTab, WhiteListTabs } from '@/src/components/pools/whitelist/nft/WhiteListTabs'
import {
  NftType,
  NftWhitelistProcess,
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

  const [currentNftWhiteListStep, setCurrentNftWhiteListStep] = useState(NftWhiteListStep.nftType)
  const [nftType, setNftType] = useState(NftType.erc721)
  const [nftWhiteListProcess, setNftWhiteListProcess] = useState(NftWhitelistProcess.unlimited)

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
            currentStep={currentNftWhiteListStep}
            nftType={nftType}
            onClose={onClose}
            setCurrentStep={setCurrentNftWhiteListStep}
            setNftType={setNftType}
            setWhiteListProcess={setNftWhiteListProcess}
            whiteListProcess={nftWhiteListProcess}
          ></NftWhiteList>
        )}
      </WhiteListTabs>
    </Modal>
  )
}

export default WhiteListModal
