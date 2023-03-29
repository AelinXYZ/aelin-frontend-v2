import { Dispatch, ReactElement, SetStateAction, useMemo, useState } from 'react'
import styled from 'styled-components'

import { isAddress } from '@ethersproject/address'
import InfiniteScroll from 'react-infinite-scroll-component'

import AddressesWhiteListWrapper from './AddressesWhiteListWrapper'
import { DecimalWarning, DuplicatedAddressesWarning, Uint256Warning } from './Warnings'
import WhiteListRow from './WhiteListRow'
import { ModalButtonCSS } from '@/src/components/common/Modal'
import { LabeledRadioButton } from '@/src/components/form/LabeledRadioButton'
import UploadCSV from '@/src/components/pools/whitelist/addresses/UploadWhiteListCsv'
import {
  ButtonGradient,
  ButtonPrimaryLight,
  ButtonPrimaryLightSm,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { Error as BaseError } from '@/src/components/pureStyledComponents/text/Error'
import { PrivacyType } from '@/src/constants/pool'

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
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
`

const MainButton = styled(ButtonGradient)`
  ${ModalButtonCSS}
`

const CancelButton = styled(ButtonPrimaryLight)`
  min-width: 160px;
`

const Error = styled(BaseError)`
  margin-bottom: -28px;
`

const AmountFormatDescription = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.4;
  margin: 30px 0 10px;
  max-width: 100%;
  text-align: center;
`

const AmountFormatsWrapper = styled.div`
  display: flex;
  gap: 40px;
  margin: 0;
  max-width: fit-content;
`

const RelativeRow = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
`

const TotalAddressesWrapper = styled.div`
  display: flex;
  gap: 4px;
  position: absolute;
  top: 0;
  left: 0;
`

const TotalAddressesLabel = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 2;
  letter-spacing: 0.35px;
`

const TotalAddressesValue = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 2;
  letter-spacing: 0.35px;
`

export enum AddressesWhiteListStep {
  format = 'format',
  addresses = 'addresses',
}

interface AddressesWhiteListStepInfo {
  order: number
  title: string
  id: AddressesWhiteListStep
}

export const addressesWhiteListStepsConfig: Record<
  AddressesWhiteListStep,
  AddressesWhiteListStepInfo
> = {
  [AddressesWhiteListStep.format]: {
    id: AddressesWhiteListStep.format,
    order: 1,
    title: 'Format',
  },
  [AddressesWhiteListStep.addresses]: {
    id: AddressesWhiteListStep.addresses,
    order: 2,
    title: 'Addresses',
  },
}

export enum AddressesWhiteListAmountFormat {
  decimal = 'Decimal',
  uint256 = 'uint256',
}

export interface AddressWhiteListProps {
  index: number
  address: string
  amount: string | null
}

export const addInitialAddressesWhiteListValues = (list: AddressWhiteListProps[] = []) => {
  let index = list.length

  return new Array(5).fill({ address: '', amount: null }).map((item) => {
    const newList = { index, ...item }
    index++
    return newList
  })
}

enum AddressesWhiteListStatus {
  invalidAddress,
  duplicatedAddresses,
  invalidAmount,
  invalidDecimals,
  valid,
}

const getError = (status: AddressesWhiteListStatus): ReactElement | null => {
  switch (status) {
    case AddressesWhiteListStatus.invalidAddress:
      return <Error textAlign="center">There is some invalid address in the list</Error>
    case AddressesWhiteListStatus.duplicatedAddresses:
      return <Error textAlign="center">There are duplicated addresses in the list</Error>
    case AddressesWhiteListStatus.invalidAmount:
      return <Error textAlign="center">There is some empty amount in the list</Error>
    case AddressesWhiteListStatus.invalidDecimals:
      return <Error textAlign="center">There is some amount with decimals in the list</Error>
    case AddressesWhiteListStatus.valid:
      return null
  }
}

const PAGE_SIZE = 100

const AddressesWhiteList = ({
  amountFormat,
  currentStep,
  list,
  onClose,
  onConfirm,
  setAmountFormat,
  setCurrentStep,
}: {
  list: AddressWhiteListProps[]
  onClose: () => void
  onConfirm: (
    whitelist: AddressWhiteListProps[],
    type: string,
    amountFormat: AddressesWhiteListAmountFormat,
  ) => void
  currentStep: AddressesWhiteListStep
  setCurrentStep: Dispatch<SetStateAction<AddressesWhiteListStep>>
  amountFormat: AddressesWhiteListAmountFormat
  setAmountFormat: Dispatch<SetStateAction<AddressesWhiteListAmountFormat>>
}) => {
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [innerList, setInnerList] = useState(list)
  const [displayList, setDisplayList] = useState(list.slice(0, PAGE_SIZE))

  const status = useMemo(() => {
    if (innerList.some((item: AddressWhiteListProps) => item.address && !isAddress(item.address))) {
      return AddressesWhiteListStatus.invalidAddress
    }

    if (
      innerList.some(
        (item: AddressWhiteListProps) => item.amount && !item.amount && Number(item.amount) > 0,
      )
    ) {
      return AddressesWhiteListStatus.invalidAmount
    }

    const addressesInSet = new Set()

    if (
      innerList.some((item: AddressWhiteListProps) => {
        // Returning true means that there is at least one duplicated address
        if (addressesInSet.has(item.address)) {
          return true
        }

        // Add the address to the set only if it is a valid address
        if (isAddress(item.address)) {
          addressesInSet.add(item.address)
        }

        // Returning false means that there are no duplicated addresses.
        return false
      })
    ) {
      return AddressesWhiteListStatus.duplicatedAddresses
    }

    if (
      amountFormat === AddressesWhiteListAmountFormat.uint256 &&
      innerList.some((item: AddressWhiteListProps) => item.amount && Number(item.amount) % 1 !== 0)
    ) {
      return AddressesWhiteListStatus.invalidDecimals
    }

    return AddressesWhiteListStatus.valid
  }, [amountFormat, innerList])

  const handleUploadCSV = (whitelist: AddressWhiteListProps[]): void => {
    setInnerList(whitelist)
    setDisplayList(whitelist.slice(0, PAGE_SIZE))
  }

  const onChangeRow = (value: string | number | null, key: string, index: number) => {
    const innerListCopy = [...innerList]
    const displayListCopy = [...displayList]

    innerListCopy[index] = {
      ...innerListCopy[index],
      [key]: value,
    }

    displayListCopy[index] = {
      ...displayList[index],
      [key]: value,
    }

    setInnerList(innerListCopy)
    setDisplayList(displayListCopy)
  }

  const onDeleteRow = (rowIndex: number) => {
    setInnerList(() => [...innerList].filter((_, index) => index !== rowIndex))
    setDisplayList(() => [...displayList].filter((_, index) => index !== rowIndex))
  }

  const handleNext = () => {
    setCurrentStep(AddressesWhiteListStep.addresses)
  }

  const handleSave = () => {
    // Filter incomplete or wrong rows
    const filterRows = [
      ...innerList.filter((row: AddressWhiteListProps) => {
        return isAddress(row.address) && row.amount !== null && Number(row.amount) > 0
      }),
    ]

    onConfirm(filterRows, PrivacyType.WHITELIST, amountFormat)
    onClose()
  }

  const loadMoreRows = () => {
    const start = page * PAGE_SIZE
    const end = start + PAGE_SIZE

    // Set hasMore to false at the end of the list
    if (end > innerList.length) {
      setHasMore(false)
      return
    }

    const chunk = innerList.slice(start, end)

    setPage(page + 1)
    setDisplayList([...displayList, ...chunk])
  }

  return (
    <AddressesWhiteListWrapper currentStep={currentStep} setCurrentStep={setCurrentStep}>
      <>
        {currentStep === AddressesWhiteListStep.format && (
          <>
            {amountFormat === AddressesWhiteListAmountFormat.decimal && <DecimalWarning />}
            {amountFormat === AddressesWhiteListAmountFormat.uint256 && <Uint256Warning />}
            <AmountFormatDescription>Select the format you want to use :</AmountFormatDescription>
            <AmountFormatsWrapper>
              {Object.entries(AddressesWhiteListAmountFormat).map(([key, value]) => (
                <LabeledRadioButton
                  checked={amountFormat === value}
                  key={key}
                  label={value}
                  onClick={() => {
                    setAmountFormat(value)
                  }}
                />
              ))}
            </AmountFormatsWrapper>
            <MainButton onClick={handleNext}>Next</MainButton>
          </>
        )}
        {currentStep === AddressesWhiteListStep.addresses && (
          <>
            <DuplicatedAddressesWarning />

            <Grid>
              <TitleGrid>
                <Title>Address</Title>
                <UploadCSV onUploadCSV={handleUploadCSV} />
              </TitleGrid>
              <Title>{`Amount (${amountFormat})`}</Title>
              <div>&nbsp;</div>
            </Grid>

            <InfiniteScroll
              dataLength={displayList.length}
              hasMore={hasMore}
              loader={<></>}
              next={loadMoreRows}
            >
              <Grid>
                {displayList.map(({ address, amount, index }: AddressWhiteListProps) => (
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

            <RelativeRow>
              <TotalAddressesWrapper>
                <TotalAddressesLabel>Total addresses:</TotalAddressesLabel>
                <TotalAddressesValue>
                  {innerList.filter((item) => item.address).length}
                </TotalAddressesValue>
              </TotalAddressesWrapper>
              <ButtonPrimaryLightSm
                onClick={() => {
                  setInnerList([...innerList, ...addInitialAddressesWhiteListValues(innerList)])
                  setDisplayList([
                    ...displayList,
                    ...addInitialAddressesWhiteListValues(displayList),
                  ])
                }}
              >
                Add more rows
              </ButtonPrimaryLightSm>
            </RelativeRow>

            {getError(status)}

            <MainButton disabled={status !== AddressesWhiteListStatus.valid} onClick={handleSave}>
              Save
            </MainButton>
          </>
        )}
        <CancelButton onClick={onClose}>Cancel</CancelButton>
      </>
    </AddressesWhiteListWrapper>
  )
}

export default AddressesWhiteList
