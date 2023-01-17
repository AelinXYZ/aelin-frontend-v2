import styled from 'styled-components'

import { isAddress } from '@ethersproject/address'

import { ButtonRemove } from '@/src/components/pureStyledComponents/buttons/ButtonCircle'
import { Textfield, TextfieldState } from '@/src/components/pureStyledComponents/form/Textfield'
import { useThemeContext } from '@/src/providers/themeContextProvider'

const ButtonsGrid = styled.div`
  align-items: center;
  column-gap: 10px;
  display: grid;
  grid-template-columns: 32px 32px;
`

type Props = {
  address: string
  amount: string | number | null
  onChangeRow: (value: string | number | null, key: string, index: number) => void
  onDeleteRow: (index: number) => void
  rowIndex: number
}

const WhiteListRow = ({ address, amount, onChangeRow, onDeleteRow, rowIndex }: Props) => {
  const { currentThemeName } = useThemeContext()

  return (
    <>
      <Textfield
        name="address"
        onChange={(e) => onChangeRow(e.target.value, 'address', rowIndex)}
        placeholder="Add address..."
        status={address && !isAddress(address) ? TextfieldState.error : undefined}
        value={address}
      />
      <Textfield
        name="amount"
        onChange={(e) => {
          if (Number(e.target.value) < 0) {
            return
          }

          onChangeRow(e.target.value, 'amount', rowIndex)
        }}
        placeholder="Max allocation..."
        status={address && !amount ? TextfieldState.error : undefined}
        type="number"
        value={amount ? Number(amount).toLocaleString('en', { useGrouping: false }) : ''}
      />
      <ButtonsGrid>
        <div>&nbsp;</div>
        <ButtonRemove currentThemeName={currentThemeName} onClick={() => onDeleteRow(rowIndex)} />
      </ButtonsGrid>
    </>
  )
}

export default WhiteListRow
