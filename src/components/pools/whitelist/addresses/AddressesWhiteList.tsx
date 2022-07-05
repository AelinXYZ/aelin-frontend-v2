import { ReactElement, useMemo } from 'react'
import styled from 'styled-components'

import { isAddress } from '@ethersproject/address'

import { ModalButtonCSS } from '@/src/components/common/Modal'
import UploadCSV from '@/src/components/pools/whitelist/addresses/UploadWhiteListCsv'
import {
  ButtonGradient,
  ButtonPrimaryLight,
  ButtonPrimaryLightSm,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { ButtonRemove } from '@/src/components/pureStyledComponents/buttons/ButtonCircle'
import { Textfield, TextfieldState } from '@/src/components/pureStyledComponents/form/Textfield'
import { Error as BaseError } from '@/src/components/pureStyledComponents/text/Error'
import { useThemeContext } from '@/src/providers/themeContextProvider'

export interface AddressWhitelistProps {
  address: string
  amount: number | null
}

const Grid = styled.div`
  align-items: center;
  column-gap: 20px;
  display: grid;
  grid-template-columns: 1fr 140px 74px;
  margin: 0 0 22px;
  max-height: 290px;
  overflow: auto;
  padding: 20px 0 0 0;
  row-gap: 10px;
  width: 100%;
`

const TitleGrid = styled.div`
  align-items: center;
  column-gap: 10px;
  display: flex;
  justify-content: space-between;
`

const Title = styled.h4`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
`

const ButtonsGrid = styled.div`
  align-items: center;
  column-gap: 10px;
  display: grid;
  grid-template-columns: 32px 32px;
`

const SaveButton = styled(ButtonGradient)`
  ${ModalButtonCSS}
`

const CancelButton = styled(ButtonPrimaryLight)`
  min-width: 160px;
`

const Error = styled(BaseError)`
  margin-bottom: -28px;
`

const WhiteListRow = ({
  address,
  amount,
  maxDecimals,
  onChangeRow,
  onDeleteRow,
  rowIndex,
}: {
  address: string
  amount: number | null
  maxDecimals: number
  onChangeRow: (value: string | number | null, key: string, index: number) => void
  onDeleteRow: (index: number) => void
  rowIndex: number
}) => {
  const { currentThemeName } = useThemeContext()
  return (
    <>
      <Textfield
        onChange={(e) => onChangeRow(e.target.value, 'address', rowIndex)}
        placeholder="Add address..."
        status={address && !isAddress(address) ? TextfieldState.error : undefined}
        value={address}
      />
      <Textfield
        onChange={(e) => {
          const amount = Number(e.target.value)

          if (amount < 0) {
            return
          }

          const decimalsCount = amount.toString().split('.')[1]?.length ?? 0

          if (decimalsCount > maxDecimals) {
            return
          }

          onChangeRow(amount, 'amount', rowIndex)
        }}
        placeholder="Max allocation..."
        status={address && !amount ? TextfieldState.error : undefined}
        type="number"
        value={amount || ''}
      />
      <ButtonsGrid>
        <div>&nbsp;</div>
        <ButtonRemove currentThemeName={currentThemeName} onClick={() => onDeleteRow(rowIndex)} />
      </ButtonsGrid>
    </>
  )
}

export const initialAddressesWhitelistValues = [
  ...new Array(5).fill({
    address: '',
    amount: null,
  } as AddressWhitelistProps),
]

enum AddressesWhiteListStatus {
  invalidAddress,
  invalidAmount,
  valid,
}

const getError = (status: AddressesWhiteListStatus): ReactElement | null => {
  switch (status) {
    case AddressesWhiteListStatus.invalidAddress:
      return <Error textAlign="center">There are some invalid address in the list</Error>
    case AddressesWhiteListStatus.invalidAmount:
      return <Error textAlign="center">There are some empty amount in the list</Error>
    case AddressesWhiteListStatus.valid:
      return null
  }
}

const AddressesWhiteList = ({
  investmentTokenDecimals,
  list,
  onClose,
  onSave,
  setList,
}: {
  list: AddressWhitelistProps[]
  investmentTokenDecimals: number
  setList: (whitelist: AddressWhitelistProps[]) => void
  onClose: () => void
  onSave: (whitelist: AddressWhitelistProps[]) => void
}) => {
  const status = useMemo(() => {
    if (list.some((item: AddressWhitelistProps) => item.address && !isAddress(item.address))) {
      return AddressesWhiteListStatus.invalidAddress
    }

    if (list.some((item: AddressWhitelistProps) => item.address && !item.amount)) {
      return AddressesWhiteListStatus.invalidAmount
    }

    return AddressesWhiteListStatus.valid
  }, [list])

  const handleUploadCSV = (whitelist: AddressWhitelistProps[]): void => {
    setList(whitelist)
  }

  const onChangeRow = (value: string | number | null, key: string, index: number) => {
    const addresses = [...list]

    addresses[index] = {
      ...addresses[index],
      [key]: value,
    }
    setList(addresses)
  }

  const onDeleteRow = (rowIndex: number) => {
    setList([...list].filter((_, index) => index !== rowIndex))
  }

  const handleSave = () => {
    // Remove empty rows.
    const filterRows = [...list.filter((row: AddressWhitelistProps) => row.address)]
    onSave(filterRows)
    onClose()
  }

  return (
    <>
      <Grid>
        <TitleGrid>
          <Title>Address</Title> <UploadCSV onUploadCSV={handleUploadCSV} />
        </TitleGrid>
        <Title>Amount</Title>
        <div>&nbsp;</div>
        {list.map((listItem: AddressWhitelistProps, rowIndex: number) => (
          <>
            <WhiteListRow
              {...listItem}
              key={rowIndex}
              maxDecimals={investmentTokenDecimals}
              onChangeRow={onChangeRow}
              onDeleteRow={onDeleteRow}
              rowIndex={rowIndex}
            />
          </>
        ))}
      </Grid>
      <ButtonPrimaryLightSm onClick={() => setList(list.concat(initialAddressesWhitelistValues))}>
        Add more rows
      </ButtonPrimaryLightSm>
      {getError(status)}
      <SaveButton disabled={status !== AddressesWhiteListStatus.valid} onClick={handleSave}>
        Save
      </SaveButton>
      <CancelButton onClick={onClose}>Cancel</CancelButton>
    </>
  )
}

export default AddressesWhiteList
