import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { isAddress } from '@ethersproject/address'

import { ButtonPrimaryLightSm, GradientButton } from '../../pureStyledComponents/buttons/Button'
import { ButtonEdit, ButtonRemove } from '../../pureStyledComponents/buttons/ButtonCircle'
import { Textfield } from '../../pureStyledComponents/form/Textfield'
import { Modal as BaseModal, ModalButtonCSS } from '@/src/components/common/Modal'
import UploadCSV from '@/src/components/pools/whitelist/UploadWhiteListCsv'
import { Error as BaseError } from '@/src/components/pureStyledComponents/text/Error'

export interface WhitelistProps {
  address: string
  amount: number | null
  isSaved: boolean
}

const Modal = styled(BaseModal)`
  .modalCard {
    padding-left: 60px;
    padding-right: 60px;
  }
`

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

const ButtonSave = styled(GradientButton)`
  ${ModalButtonCSS}
`

const Error = styled(BaseError)`
  margin-bottom: -28px;
`

const WhiteListRow = ({
  address,
  amount,
  isSaved,
  onChangeRow,
  onDeleteRow,
  rowIndex,
}: {
  address: string
  amount: number | null
  isSaved: boolean
  onChangeRow: (value: string | boolean | number | null, key: string, index: number) => void
  onDeleteRow: (index: number) => void
  rowIndex: number
}) => {
  return (
    <>
      <Textfield
        disabled={isSaved}
        onChange={(e) => onChangeRow(e.target.value, 'address', rowIndex)}
        placeholder="Add address..."
        value={address}
      />
      <Textfield
        disabled={isSaved}
        onChange={(e) => onChangeRow(Number(e.target.value), 'amount', rowIndex)}
        placeholder="Max allocation..."
        type="number"
        value={amount || ''}
      />
      <ButtonsGrid>
        <ButtonEdit onClick={() => onChangeRow(false, 'isSaved', rowIndex)} />
        <ButtonRemove onClick={() => onDeleteRow(rowIndex)} />
      </ButtonsGrid>
    </>
  )
}

export const initialWhitelistValues = [
  ...new Array(5).fill({
    address: '',
    amount: null,
    isSaved: false,
  }),
]

const WhiteListModal = ({
  currentList,
  onClose,
  onConfirm,
}: {
  currentList: WhitelistProps[]
  onClose: () => void
  onConfirm: (whitelist: WhitelistProps[]) => void
}) => {
  const [error, setError] = useState<boolean>(false)
  const [list, setList] = useState(currentList.length ? currentList : initialWhitelistValues)
  const handleUploadCSV = (whitelist: WhitelistProps[]): void => {
    setList(whitelist)
  }

  const onChangeRow = (value: string | boolean | number | null, key: string, index: number) => {
    const addresses = [...list]

    addresses[index] = { ...addresses[index], [key]: value }
    setList(addresses)
  }

  const onDeleteRow = (rowIndex: number) => {
    setList([...list].filter((_, index) => index !== rowIndex))
  }

  useEffect(() => {
    setError(
      list.some((item: WhitelistProps) =>
        item.address && item.amount ? !isAddress(item.address) : false,
      ),
    )

    return () => {
      setError(false)
    }
  }, [list])

  const handleSave = () => {
    const filterRows = [
      ...list.filter(
        (row: WhitelistProps) => isAddress(row.address) && row.amount && row.amount > 0,
      ),
    ]
    const updateRows = filterRows.map((row) => ({ ...row, isSaved: true }))

    onConfirm(updateRows)
    onClose()
  }

  return (
    <Modal onClose={onClose} size="lg" title="Whitelist">
      <Grid>
        <TitleGrid>
          <Title>Address</Title> <UploadCSV onUploadCSV={handleUploadCSV} />
        </TitleGrid>
        <Title>Amount</Title>
        <div>&nbsp;</div>
        {list.map((listItem: WhitelistProps, rowIndex: number) => (
          <WhiteListRow
            {...listItem}
            key={rowIndex}
            onChangeRow={onChangeRow}
            onDeleteRow={onDeleteRow}
            rowIndex={rowIndex}
          />
        ))}
      </Grid>
      <ButtonPrimaryLightSm onClick={() => setList(list.concat(initialWhitelistValues))}>
        Add more rows
      </ButtonPrimaryLightSm>
      {error && <Error>There are some invalid address in the list</Error>}
      <ButtonSave disabled={error} onClick={handleSave}>
        Save
      </ButtonSave>
    </Modal>
  )
}

export default WhiteListModal
