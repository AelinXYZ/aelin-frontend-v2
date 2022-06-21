import styled from 'styled-components'

import NftIdSelector from './NftIdSelector'
import { SelectedNftData } from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { ButtonPrimaryLightSm } from '@/src/components/pureStyledComponents/buttons/Button'
import { ButtonRemove } from '@/src/components/pureStyledComponents/buttons/ButtonCircle'
import { Textfield } from '@/src/components/pureStyledComponents/form/Textfield'
import { useThemeContext } from '@/src/providers/themeContextProvider'

const Column = styled.div<{ gap: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap }) => gap}px;

  &:first-child {
    flex-grow: 1;
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`

export const Label = styled.div`
  font-weight: 600;
  font-size: 1.4rem;
  line-height: 20px;
  color: ${({ theme: { colors } }) => colors.textColor};
`

export const AmountInput = styled(Textfield)`
  display: flex;
  flex-shrink: 0;
  width: 140px;
  background: ${({ theme: { nftWhiteList } }) => nftWhiteList.layerBackgroundColor};
  border: ${({ theme: { nftWhiteList } }) => nftWhiteList.border};
`

export const ButtonRemoveWrapper = styled.div<{ isOffset?: boolean }>`
  display: flex;
  flex-shrink: 0;
  padding: ${({ isOffset }) => (isOffset ? '34px' : '2px')} 0 2px;
`

const AddButton = styled(ButtonPrimaryLightSm)`
  display: flex;
  align-self: center;
`

type NftsMinimumAmountsProps = {
  selectedCollectionNftsIds: string[]
  selectedNftsData: SelectedNftData[]
  onNftMinimumAmountChange: (nftIndex: number, amount: number) => void
  onNewNftAdd: () => void
  onNftIdChange: (nftIndex: number, id: string) => void
  onNftDelete: (nftIndex: number) => void
}

const NftsMinimumAmounts = ({
  onNewNftAdd,
  onNftDelete,
  onNftIdChange,
  onNftMinimumAmountChange,
  selectedCollectionNftsIds,
  selectedNftsData,
}: NftsMinimumAmountsProps) => {
  const { currentThemeName } = useThemeContext()

  return (
    <Column gap={16}>
      <Column gap={10}>
        {selectedNftsData.map((selectedNft, nftIndex) => (
          <Row key={selectedNft.id ?? 'empty'}>
            <Column gap={12}>
              {nftIndex === 0 && <Label>ID(s)</Label>}
              <NftIdSelector
                ids={selectedCollectionNftsIds}
                onChange={(id) => onNftIdChange(nftIndex, id)}
                selectedId={selectedNft.id}
              />
            </Column>
            <Column gap={12}>
              {nftIndex === 0 && <Label>Minimum amount</Label>}
              <AmountInput
                key={nftIndex}
                maxLength={8}
                onChange={(e) => {
                  onNftMinimumAmountChange(nftIndex, Number(e.target.value))
                }}
                placeholder="0"
                type="number"
                value={selectedNft.minimumAmount || ''}
              />
            </Column>
            {selectedNftsData.length > 1 && (
              <ButtonRemoveWrapper isOffset={nftIndex === 0}>
                <ButtonRemove
                  currentThemeName={currentThemeName}
                  onClick={() => {
                    onNftDelete(nftIndex)
                  }}
                />
              </ButtonRemoveWrapper>
            )}
          </Row>
        ))}
      </Column>
      {selectedNftsData[selectedNftsData.length - 1]?.id && (
        <AddButton
          onClick={() => {
            onNewNftAdd()
          }}
        >
          Add ID
        </AddButton>
      )}
    </Column>
  )
}

export default NftsMinimumAmounts
