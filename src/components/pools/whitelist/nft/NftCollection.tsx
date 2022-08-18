import styled from 'styled-components'

import NftCollectionDetails from '@/src/components/pools/whitelist/nft/NftCollectionDetails'
import NftCollectionInput from '@/src/components/pools/whitelist/nft/NftCollectionInput'
import NftsMinimumAmounts, {
  AmountInput,
  ButtonRemoveWrapper,
  Label,
} from '@/src/components/pools/whitelist/nft/NftsMinimumAmounts'
import {
  NftType,
  NftWhitelistProcess,
  SelectedNftCollectionData,
} from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { ButtonRemove } from '@/src/components/pureStyledComponents/buttons/ButtonCircle'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { TextfieldState } from '@/src/components/pureStyledComponents/form/Textfield'
import { NftCollectionData } from '@/src/hooks/aelin/useNftCollectionLists'
import { useThemeContext } from '@/src/providers/themeContextProvider'
import abbreviateNumber from '@/src/utils/abbreviateNumber'

const Card = styled(BaseCard)<{ isBorder?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 80%;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    width: 450px;
  }

  background: ${({ isBorder }) =>
    isBorder ? ({ theme: { nftWhiteList } }) => nftWhiteList.layerBackgroundColor : 'none'};
  border: ${({ isBorder }) =>
    isBorder ? ({ theme: { nftWhiteList } }) => `1px solid ${nftWhiteList.border}` : 'none'};
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
  nftType: NftType
}

const NftCollection = ({
  canRemove,
  isBorder,
  nftType,
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
          nftType={nftType}
          onChange={dispatchUpdateCollection}
          selectedCollection={selectedCollection}
        />
      </Card>
    )

  const selectedCollectionAmount =
    whiteListProcess === NftWhitelistProcess.limitedPerWallet
      ? selectedCollection.amountPerWallet
      : selectedCollection.amountPerNft

  const generateAttributes = (nftCollectionData: NftCollectionData) => {
    const attributes = []
    if (nftCollectionData.totalSupply) {
      attributes.push({
        name: 'Items',
        value: abbreviateNumber(nftCollectionData.totalSupply),
        currencyImageUrl: undefined,
      })
    }

    if (nftCollectionData.numOwners) {
      attributes.push({
        name: 'Owners',
        value: abbreviateNumber(nftCollectionData.numOwners),
        currencyImageUrl: undefined,
      })
    }

    if (nftCollectionData.floorPrice) {
      attributes.push({
        name: 'Floor price',
        value: abbreviateNumber(nftCollectionData.floorPrice),
        currencyImageUrl: undefined,
      })
    }

    if (nftCollectionData.totalVolume) {
      attributes.push({
        name: 'Volume traded',
        value: abbreviateNumber(nftCollectionData.totalVolume),
        currencyImageUrl: undefined,
      })
    }

    return attributes
  }

  return (
    <Card isBorder={isBorder}>
      <Row>
        <Column>
          {whiteListProcess !== NftWhitelistProcess.unlimited && <Label>NFT Collection</Label>}
          <NftCollectionInput
            nftType={nftType}
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
            attributes={generateAttributes(selectedCollection.nftCollectionData)}
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
