import { ReactElement, useMemo, useState } from 'react'
import styled from 'styled-components'

import { isAddress } from '@ethersproject/address'
import { debounce } from 'lodash'
import ms from 'ms'
import InfiniteScroll from 'react-infinite-scroll-component'

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
import { PrivacyType } from '@/src/constants/pool'
import { useThemeContext } from '@/src/providers/themeContextProvider'

export type CSVParseType = [number, string, string]
export type CSVParseTypeArray = Array<CSVParseType>

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

const NUMBER_ROWS = 100

const WhiteListRow = ({
  address,
  amount,
  onChangeRow,
  onDeleteRow,
  rowIndex,
}: {
  address: string
  amount: string
  onChangeRow: (value: string, key: string, index: number) => void
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

const initialAddressesWhitelistValues = (existingArray: CSVParseType[] = []): CSVParseType[] => {
  const startIndex = existingArray.length ? existingArray.length + 1 : 0
  const defaultValues: CSVParseType[] = Array.from(Array(5), (_, i) => [i + startIndex, '', ''])

  return [...existingArray, ...defaultValues]
}

enum AddressesWhiteListStatus {
  invalidAddress,
  invalidAmount,
  invalidDecimals,
  valid,
}

const getError = (status: AddressesWhiteListStatus): ReactElement | null => {
  switch (status) {
    case AddressesWhiteListStatus.invalidAddress:
      return <Error textAlign="center">There are some invalid address in the list</Error>
    case AddressesWhiteListStatus.invalidAmount:
      return <Error textAlign="center">There are some empty amount in the list</Error>
    case AddressesWhiteListStatus.invalidDecimals:
      return <Error textAlign="center">There are some amount with decimals in the list</Error>
    case AddressesWhiteListStatus.valid:
      return null
  }
}

const AddressesWhiteList = ({
  list,
  onClose,
  onConfirm,
}: {
  list: CSVParseType[]
  onClose: () => void
  onConfirm: (whitelist: CSVParseType[], type: string) => void
}) => {
  const [innerList, setInnerList] = useState(list)

  const [infiniteRows, setInfiniteRows] = useState(() =>
    innerList.length ? innerList.slice(0, NUMBER_ROWS) : initialAddressesWhitelistValues(),
  )

  const status = useMemo(() => {
    if (innerList.some((item: CSVParseType) => item[0] && !isAddress(item[1]))) {
      return AddressesWhiteListStatus.invalidAddress
    }

    if (innerList.some((item: CSVParseType) => item[0] && !item[2])) {
      return AddressesWhiteListStatus.invalidAmount
    }

    if (innerList.some((item: CSVParseType) => item[2] && Number(item[2]) % 1 !== 0)) {
      return AddressesWhiteListStatus.invalidDecimals
    }

    return AddressesWhiteListStatus.valid
  }, [innerList])

  const handleUploadCSV = (whitelist: CSVParseType[]): void => {
    setInnerList(whitelist)
    setInfiniteRows(whitelist.slice(0, NUMBER_ROWS))
  }

  const getChunk = () => {
    const start = infiniteRows.length
    const end = start + NUMBER_ROWS
    return [start, end]
  }

  const onChangeRow = (value: string, key: string, index: number) => {
    const list = [...innerList]

    const row = list.findIndex(([i]) => i === index)

    if (row !== -1) {
      if (key === 'address') {
        list[row][1] = value
      }

      if (key === 'amount') {
        list[row][2] = value
      }

      setInnerList(list)

      const [start, end] = getChunk()
      setInfiniteRows(list.slice(start, end))
    }
  }

  const onDeleteRow = (rowIndex: number) => {
    const list = [...innerList].filter((val) => val[0] !== rowIndex)
    setInnerList(list)

    const [start, end] = getChunk()
    setInfiniteRows(list.slice(start, end))
  }

  const handleSave = () => {
    // Filter incomplete or wrong rows
    const filterRows = innerList.reduce((accum, curr, index) => {
      const [_, address, amount] = curr

      if (isAddress(address) && amount !== '') {
        accum.push([index, address, amount])
      }

      return accum
    }, [] as CSVParseType[])

    onConfirm(filterRows, PrivacyType.WHITELIST)
    onClose()
  }

  const addMore = () => {
    const [start, end] = getChunk()
    setInfiniteRows([...infiniteRows, ...innerList.slice(start, end)])
  }

  const debouncedAddMore = debounce(addMore, ms('1s'))

  return (
    <>
      <Grid>
        <TitleGrid>
          <Title>Address</Title>
          <UploadCSV onUploadCSV={handleUploadCSV} />
        </TitleGrid>
        <Title>Amount (uint256)</Title>
        <div>&nbsp;</div>
      </Grid>
      <InfiniteScroll
        dataLength={infiniteRows.length}
        hasMore={true}
        loader={<></>}
        next={debouncedAddMore}
      >
        <Grid>
          {infiniteRows.map(([index, address, amount]: CSVParseType) => (
            <WhiteListRow
              address={address}
              amount={amount}
              key={index}
              onChangeRow={onChangeRow}
              onDeleteRow={onDeleteRow}
              rowIndex={index}
            />
          ))}
        </Grid>
      </InfiniteScroll>

      <ButtonPrimaryLightSm
        onClick={() => setInnerList(initialAddressesWhitelistValues(innerList))}
      >
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
