import styled from 'styled-components'

import { SelectedNftData } from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { ButtonPrimaryLightSm } from '@/src/components/pureStyledComponents/buttons/Button'
import { ButtonRemove } from '@/src/components/pureStyledComponents/buttons/ButtonCircle'
import { Textfield, TextfieldState } from '@/src/components/pureStyledComponents/form/Textfield'
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

export const IdInput = styled(Textfield)`
  display: flex;
  flex-grow: 1;
`

export const AmountInput = styled(Textfield)`
  display: flex;
  flex-shrink: 0;
  width: 140px;
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
  selectedNftsData: SelectedNftData[]
  invalidNftIds: Set<number>
  onNftMinimumAmountChange: (nftIndex: number, amount: number) => void
  onNewNftAdd: () => void
  onNftIdChange: (nftIndex: number, nftId?: number) => void
  onNftDelete: (nftIndex: number) => void
}

const NftsMinimumAmounts = ({
  invalidNftIds,
  onNewNftAdd,
  onNftDelete,
  onNftIdChange,
  onNftMinimumAmountChange,
  selectedNftsData,
}: NftsMinimumAmountsProps) => {
  const { currentThemeName } = useThemeContext()

  return (
    <Column gap={16}>
      <Column gap={10}>
        {selectedNftsData.map((selectedNft, selectedNftIndex) => (
          <Row key={selectedNft.id}>
            <Column gap={12}>
              {selectedNftIndex === 0 && <Label>ID(s)</Label>}
              <IdInput
                onChange={(e) => {
                  if (e.target.value.trim() === '') {
                    onNftIdChange(selectedNftIndex, undefined)
                    return
                  }

                  const id = Number(e.target.value)
                  if (isNaN(id) || id < 0 || id % 1 !== 0) {
                    return
                  }

                  onNftIdChange(selectedNftIndex, id)
                }}
                pattern="[0-9]"
                placeholder="Enter ERC-1155 ID"
                status={invalidNftIds.has(selectedNft.id) ? TextfieldState.error : undefined}
                type="text"
                value={selectedNft.nftId === undefined ? '' : selectedNft.nftId}
              />
            </Column>
            <Column gap={12}>
              {selectedNftIndex === 0 && <Label>Minimum amount</Label>}
              <AmountInput
                onChange={(e) => {
                  if (e.target.value.trim() === '') {
                    onNftMinimumAmountChange(selectedNftIndex, 0)
                    return
                  }

                  const amount = Number(e.target.value)
                  if (isNaN(amount) || amount < 0 || amount % 1 !== 0) {
                    return
                  }

                  onNftMinimumAmountChange(selectedNftIndex, amount)
                }}
                pattern="[0-9]"
                placeholder="0"
                status={
                  selectedNft.nftId !== undefined && selectedNft.minimumAmount === 0
                    ? TextfieldState.error
                    : undefined
                }
                type="text"
                value={selectedNft.minimumAmount || ''}
              />
            </Column>
            {selectedNftsData.length > 1 && (
              <ButtonRemoveWrapper isOffset={selectedNftIndex === 0}>
                <ButtonRemove
                  currentThemeName={currentThemeName}
                  onClick={() => {
                    onNftDelete(selectedNftIndex)
                  }}
                />
              </ButtonRemoveWrapper>
            )}
          </Row>
        ))}
      </Column>
      <AddButton
        onClick={() => {
          onNewNftAdd()
        }}
      >
        Add ID
      </AddButton>
    </Column>
  )
}

export default NftsMinimumAmounts
