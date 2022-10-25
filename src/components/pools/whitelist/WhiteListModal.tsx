import { useState } from 'react'
import styled from 'styled-components'

import { Modal as BaseModal } from '@/src/components/common/Modal'
import AddressesWhiteList, {
  AddressWhitelistProps,
  initialAddressesWhitelistValues,
} from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
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

const Note = styled.p`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.transparentWhite2};
  border: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  border-radius: 8px;
`

type WhiteListType = {
  poolPrivacy: Privacy | undefined
  currentList: AddressWhitelistProps[]
  investmentTokenDecimals: number
  onClose: () => void
  onConfirm: (
    whitelist: AddressWhitelistProps[] | NftCollectionRulesProps[],
    type: NftType | string,
  ) => void
  withMerkleTree: boolean | undefined
}

const WhiteListModal = ({
  currentList,
  investmentTokenDecimals,
  onClose,
  onConfirm,
  poolPrivacy,
}: WhiteListType) => {
  const [addressesWhiteList, setAddressesWhiteList] = useState(
    currentList.length ? currentList : initialAddressesWhitelistValues,
  )

  const { dispatch, nftWhiteListState } = useNftCreationState()

  if (!poolPrivacy) return null

  return (
    <Modal onClose={onClose} showCancelButton={false} size="794px" title="Allowlist">
      {poolPrivacy === Privacy.PRIVATE && (
        <>
          <Note>
            Please input the amount as a <b>uint256</b>. If you are using an investment token with 6
            decimals then <b>1000000</b> is equivalent to <b>1</b> investment token.
          </Note>

          <AddressesWhiteList
            investmentTokenDecimals={investmentTokenDecimals}
            list={addressesWhiteList}
            onClose={onClose}
            onConfirm={onConfirm}
            setList={setAddressesWhiteList}
          />
        </>
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
