import styled from 'styled-components'

import NftCollectionDetails from '@/src/components/pools/whitelist/nft/NftCollectionDetails'
import NftCollectionInput from '@/src/components/pools/whitelist/nft/NftCollectionInput'
import NftsMinimumAmounts, {
  AmountInput,
  ButtonRemoveWrapper,
  Label,
} from '@/src/components/pools/whitelist/nft/NftsMinimumAmounts'
import {
  NftWhitelistProcess,
  SelectedNftCollectionData,
} from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { ButtonRemove } from '@/src/components/pureStyledComponents/buttons/ButtonCircle'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { TextfieldState } from '@/src/components/pureStyledComponents/form/Textfield'
import { NftCollectionData } from '@/src/hooks/aelin/useNftCollectionList'
import { useThemeContext } from '@/src/providers/themeContextProvider'
import abbreviateNumber from '@/src/utils/abbreviateNumber'

const Card = styled(BaseCard)<{ isBorder?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: ${({ isBorder }) =>
    isBorder ? ({ theme: { nftWhiteList } }) => nftWhiteList.layerBackgroundColor : 'none'};
  border: ${({ isBorder }) =>
    isBorder ? ({ theme: { nftWhiteList } }) => nftWhiteList.border : 'none'};
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  &:first-child {
    flex-grow: 1;
  }
`

type NftCollectionProps = {
  whiteListProcess: NftWhitelistProcess
  selectedCollection: SelectedNftCollectionData
  canRemove: boolean
  isBorder: boolean
  onCollectionChange: (value: NftCollectionData) => void
  onCollectionRemove: () => void
  onAmountPerWalletChange: (amount?: number) => void
  onAmountPerNftChange: (amount?: number) => void
  onNftMinimumAmountChange: (nftIndex: number, amount: number) => void
  onNewNftAdd: () => void
  onNftIdChange: (nftIndex: number, nftId?: number) => void
  onNftDelete: (nftIndex: number) => void
}

const NftCollection = ({
  canRemove,
  isBorder,
  onAmountPerNftChange,
  onAmountPerWalletChange,
  onCollectionChange,
  onCollectionRemove,
  onNewNftAdd,
  onNftDelete,
  onNftIdChange,
  onNftMinimumAmountChange,
  selectedCollection,
  whiteListProcess,
}: NftCollectionProps) => {
  const { currentThemeName } = useThemeContext()

  const dispatchUpdateCollection = (value: NftCollectionData) => {
    onCollectionChange(value)
  }

  if (!selectedCollection.nftCollectionData)
    return (
      <Card isBorder={isBorder}>
        <NftCollectionInput
          onChange={dispatchUpdateCollection}
          selectedCollection={selectedCollection}
        />
      </Card>
    )

  const selectedCollectionAmount =
    whiteListProcess === NftWhitelistProcess.limitedPerWallet
      ? selectedCollection.amountPerWallet
      : selectedCollection.amountPerNft

  return (
    <Card isBorder={isBorder}>
      <Row>
        <Column>
          {whiteListProcess !== NftWhitelistProcess.unlimited && <Label>NFT Collection</Label>}
          <NftCollectionInput
            onChange={dispatchUpdateCollection}
            selectedCollection={selectedCollection}
          />
        </Column>
        {(whiteListProcess === NftWhitelistProcess.limitedPerWallet ||
          whiteListProcess === NftWhitelistProcess.limitedPerNft) && (
          <Column>
            <Label>
              {whiteListProcess === NftWhitelistProcess.limitedPerWallet
                ? 'Amount per wallet'
                : 'Amount per NFT'}
            </Label>
            <AmountInput
              min="0"
              onChange={(e) => {
                const amount = e.target.value.trim() === '' ? undefined : Number(e.target.value)

                if (whiteListProcess === NftWhitelistProcess.limitedPerWallet) {
                  onAmountPerWalletChange(amount)
                  return
                }

                onAmountPerNftChange(amount)
              }}
              placeholder="0"
              status={
                selectedCollectionAmount === undefined || selectedCollectionAmount <= 0
                  ? TextfieldState.error
                  : undefined
              }
              type="number"
              value={selectedCollectionAmount ?? ''}
            />
          </Column>
        )}
        {canRemove && (
          <ButtonRemoveWrapper isOffset={whiteListProcess !== NftWhitelistProcess.unlimited}>
            <ButtonRemove
              currentThemeName={currentThemeName}
              onClick={() => {
                onCollectionRemove()
              }}
            />
          </ButtonRemoveWrapper>
        )}
      </Row>
      {selectedCollection.nftCollectionData && (
        <>
          {whiteListProcess === NftWhitelistProcess.minimumAmount && (
            <NftsMinimumAmounts
              invalidNftIds={selectedCollection.invalidNftIds}
              onNewNftAdd={onNewNftAdd}
              onNftDelete={onNftDelete}
              onNftIdChange={onNftIdChange}
              onNftMinimumAmountChange={onNftMinimumAmountChange}
              selectedNftsData={selectedCollection.selectedNftsData}
            />
          )}
          <NftCollectionDetails
            attributes={[
              {
                name: 'Items',
                value: abbreviateNumber(selectedCollection.nftCollectionData.totalSupply),
                currencyImageUrl: undefined,
              },
              {
                name: 'Owners',
                value: abbreviateNumber(selectedCollection.nftCollectionData.numOwners),
                currencyImageUrl: undefined,
              },
              {
                name: 'Floor price',
                value: abbreviateNumber(selectedCollection.nftCollectionData.floorPrice ?? 0),
                currencyImageUrl: undefined,
              },
              {
                name: 'Volume traded',
                value: abbreviateNumber(selectedCollection.nftCollectionData.totalVolume ?? 0),
                currencyImageUrl: undefined,
              },
            ]}
            imageUrl={selectedCollection.nftCollectionData.imageUrl}
            isVerified={selectedCollection.nftCollectionData.isVerified}
            name={selectedCollection.nftCollectionData.name}
          />
        </>
      )}
    </Card>
  )
}

export default NftCollection
