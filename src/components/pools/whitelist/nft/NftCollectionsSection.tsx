import { Dispatch } from 'react'
import styled from 'styled-components'

import NftCollection from '@/src/components/pools/whitelist/nft/NftCollection'
import {
  NftWhiteListAction,
  NftWhiteListActionType,
  NftWhitelistProcess,
  SelectedNftCollectionData,
} from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { ButtonPrimaryLightSm } from '@/src/components/pureStyledComponents/buttons/Button'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 20px;
`

const AddButton = styled(ButtonPrimaryLightSm)`
  display: flex;
  align-self: center;
  margin-top: 6px;
`

type NftCollectionsSectionProps = {
  whiteListProcess: NftWhitelistProcess
  selectedCollections: SelectedNftCollectionData[]
  dispatch: Dispatch<NftWhiteListAction>
}

const NftCollectionsSection = ({
  dispatch,
  selectedCollections,
  whiteListProcess,
}: NftCollectionsSectionProps) => {
  return (
    <Wrapper>
      {selectedCollections.map((selectedCollection, index) => (
        <NftCollection
          canRemove={selectedCollections.length > 1 && !!selectedCollection.nftCollectionData}
          isBorder={selectedCollections.length > 1 || !!selectedCollection.nftCollectionData}
          key={selectedCollection.nftCollectionData?.id ?? 'empty'}
          onAmountPerNftChange={(amount) => {
            dispatch({
              type: NftWhiteListActionType.updateAmountPerNft,
              payload: { index: index, amount: amount },
            })
          }}
          onAmountPerWalletChange={(amount) => {
            dispatch({
              type: NftWhiteListActionType.updateAmountPerWallet,
              payload: { index: index, amount: amount },
            })
          }}
          onCollectionChange={(value) => {
            dispatch({
              type: NftWhiteListActionType.updateCollection,
              payload: {
                index: index,
                newCollection: value,
              },
            })
          }}
          onCollectionRemove={() => {
            dispatch({
              type: NftWhiteListActionType.removeCollection,
              payload: index,
            })
          }}
          onNewNftAdd={() => {
            dispatch({
              type: NftWhiteListActionType.addEmptyNft,
              payload: index,
            })
          }}
          onNftDelete={(nftIndex) => {
            dispatch({
              type: NftWhiteListActionType.deleteNft,
              payload: {
                collectionIndex: index,
                nftIndex: nftIndex,
              },
            })
          }}
          onNftIdChange={(nftIndex, id) => {
            dispatch({
              type: NftWhiteListActionType.updateNftId,
              payload: {
                collectionIndex: index,
                nftIndex: nftIndex,
                id: id,
              },
            })
          }}
          onNftMinimumAmountChange={(nftIndex, amount) => {
            dispatch({
              type: NftWhiteListActionType.updateNftMinimumAmount,
              payload: {
                collectionIndex: index,
                nftIndex: nftIndex,
                amount: amount,
              },
            })
          }}
          selectedCollection={selectedCollection}
          whiteListProcess={whiteListProcess}
        />
      ))}
      {selectedCollections[selectedCollections.length - 1].nftCollectionData && (
        <AddButton
          onClick={() => {
            dispatch({
              type: NftWhiteListActionType.addEmptyCollection,
              payload: undefined,
            })
          }}
        >
          Add collection
        </AddButton>
      )}
    </Wrapper>
  )
}

export default NftCollectionsSection
