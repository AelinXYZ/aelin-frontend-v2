import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { isAddress } from '@ethersproject/address'

import { ButtonPrimary, ButtonPrimaryLight } from '../pureStyledComponents/buttons/Button'
import { Textfield } from '../pureStyledComponents/form/Textfield'
import { Modal } from '@/src/components/common/Modal'
import UploadCSV from '@/src/components/pools/UploadWhiteListCsv'

export interface WhitelistProps {
  address: string
  amount: number | null
  isSaved: boolean
}

const ContentGrid = styled.div`
  display: grid;
  row-gap: 10px;
  column-gap: 20px;
  width: 100%;
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    grid-template-columns: 2fr 1fr 0.2fr 0.2fr;
  }
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

      <button onClick={() => onChangeRow(false, 'isSaved', rowIndex)}>edit</button>
      <button onClick={() => onDeleteRow(rowIndex)}>remove</button>
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
      <UploadCSV onUploadCSV={handleUploadCSV} />
      <br />
      <ContentGrid>
        <>
          <div>Address</div>
          <div>Amount</div>
          <div></div>
          <div></div>
        </>
        {list.map((listItem: WhitelistProps, rowIndex: number) => (
          <WhiteListRow
            {...listItem}
            key={rowIndex}
            onChangeRow={onChangeRow}
            onDeleteRow={onDeleteRow}
            rowIndex={rowIndex}
          />
        ))}
      </ContentGrid>
      <ButtonPrimaryLight onClick={() => setList(list.concat(initialWhitelistValues))}>
        Add more rows
      </ButtonPrimaryLight>
      <br />
      {error && <p>There are some invalid address in the list</p>}
      <ButtonPrimary disabled={error} onClick={handleSave}>
        Save
      </ButtonPrimary>
      <br />
    </Modal>
  )
}

export default WhiteListModal
