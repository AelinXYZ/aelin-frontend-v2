import { Dispatch, ReactElement, SetStateAction, useMemo } from 'react'
import styled from 'styled-components'

import { isAddress } from '@ethersproject/address'

import { ModalButtonCSS } from '@/src/components/common/Modal'
import { LabeledRadioButton } from '@/src/components/form/LabeledRadioButton'
import UploadCSV from '@/src/components/pools/whitelist/addresses/UploadWhiteListCsv'
import {
  ButtonGradient,
  ButtonPrimaryLight,
  ButtonPrimaryLightSm,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { ButtonRemove } from '@/src/components/pureStyledComponents/buttons/ButtonCircle'
import {
  ButtonNext,
  ButtonPrev,
} from '@/src/components/pureStyledComponents/buttons/ButtonPrevNext'
import { Textfield, TextfieldState } from '@/src/components/pureStyledComponents/form/Textfield'
import { Error as BaseError } from '@/src/components/pureStyledComponents/text/Error'
import { StepIndicator } from '@/src/components/steps/StepIndicator'
import { PrivacyType } from '@/src/constants/pool'
import { useThemeContext } from '@/src/providers/themeContextProvider'

export interface AddressWhitelistProps {
  address: string
  amount: number | null
}

const WrapperGrid = styled.div`
  width: 700px;
  display: grid;
  grid-template-columns: 50px 1fr 50px;
`

const StepContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PrevWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-right: 20px;
`

const NextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
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

const Note = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  gap: 20px;
  background-color: ${({ theme }) => theme.colors.transparentWhite2};
  border: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  border-radius: 8px;
  text-align: center;
`

const ExampleRow = styled.div`
  display: flex;
  gap: 20px;
`

const ExampleAddress = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 20px 0px 10px;
  width: 340px;
  height: 36px;
  background: #282e3b;
  border: 1px solid #8280ff;
  border-radius: 8px;
`

const ExampleAmount = styled(ExampleAddress)`
  width: 140px;
`

const ButtonsGrid = styled.div`
  align-items: center;
  column-gap: 10px;
  display: grid;
  grid-template-columns: 32px 32px;
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
  font-size: 1.4rem;
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

export enum AddressesWhiteListStep {
  format = 'format',
  addresses = 'addresses',
}

interface AddressesWhiteListStepInfo {
  order: number
  title: string
  id: AddressesWhiteListStep
}

const addressesWhiteListStepsConfig: Record<AddressesWhiteListStep, AddressesWhiteListStepInfo> = {
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

const getStepIndicatorData = (
  currentStep: AddressesWhiteListStep,
): { title: string; isActive: boolean }[] =>
  Object.values(AddressesWhiteListStep).map((step) => ({
    isActive: currentStep === step,
    title: addressesWhiteListStepsConfig[step].title,
  }))

const WhiteListRow = ({
  address,
  amount,
  amountFormat,
  onChangeRow,
  onDeleteRow,
  rowIndex,
}: {
  address: string
  amount: number | null
  amountFormat: AddressesWhiteListAmountFormat
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

          if (amountFormat === AddressesWhiteListAmountFormat.uint256 && amount < 0) {
            return
          }

          onChangeRow(amount, 'amount', rowIndex)
        }}
        placeholder="Max allocation..."
        status={address && !amount ? TextfieldState.error : undefined}
        type="number"
        value={amount?.toLocaleString('en', { useGrouping: false }) || ''}
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

const AddressesWhiteList = ({
  amountFormat,
  currentStep,
  list,
  onClose,
  onConfirm,
  setAmountFormat,
  setCurrentStep,
  setList,
}: {
  list: AddressWhitelistProps[]
  setList: (whitelist: AddressWhitelistProps[]) => void
  onClose: () => void
  onConfirm: (
    whitelist: AddressWhitelistProps[],
    type: string,
    amountFormat: AddressesWhiteListAmountFormat,
  ) => void
  currentStep: AddressesWhiteListStep
  setCurrentStep: Dispatch<SetStateAction<AddressesWhiteListStep>>
  amountFormat: AddressesWhiteListAmountFormat
  setAmountFormat: Dispatch<SetStateAction<AddressesWhiteListAmountFormat>>
}) => {
  const { order } = addressesWhiteListStepsConfig[currentStep]

  const status = useMemo(() => {
    if (list.some((item: AddressWhitelistProps) => item.address && !isAddress(item.address))) {
      return AddressesWhiteListStatus.invalidAddress
    }

    const validAddresses = list.reduce((result, item) => {
      if (item.address) {
        result.push(item.address)
      }

      return result
    }, [] as Array<string>)

    if (new Set(validAddresses).size != validAddresses.length) {
      return AddressesWhiteListStatus.duplicatedAddresses
    }

    if (list.some((item: AddressWhitelistProps) => item.address && !item.amount)) {
      return AddressesWhiteListStatus.invalidAmount
    }

    if (
      amountFormat === AddressesWhiteListAmountFormat.uint256 &&
      list.some((item: AddressWhitelistProps) => item.amount && item.amount % 1 !== 0)
    ) {
      return AddressesWhiteListStatus.invalidDecimals
    }

    return AddressesWhiteListStatus.valid
  }, [list, amountFormat])

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

  const handleNext = () => {
    setCurrentStep(AddressesWhiteListStep.addresses)
  }

  const handleSave = () => {
    // Remove empty rows.
    const filterRows = [...list.filter((row: AddressWhitelistProps) => row.address)]
    onConfirm(filterRows, PrivacyType.WHITELIST, amountFormat)
    onClose()
  }

  const isFirstStep = addressesWhiteListStepsConfig[currentStep].order === 1
  const isLastStep =
    addressesWhiteListStepsConfig[currentStep].order ===
    Object.keys(addressesWhiteListStepsConfig).length

  const prevStep = Object.values(addressesWhiteListStepsConfig).find(
    ({ order }) => order === addressesWhiteListStepsConfig[currentStep].order - 1,
  )?.id

  const nextStep = Object.values(addressesWhiteListStepsConfig).find(
    ({ order }) => order === addressesWhiteListStepsConfig[currentStep].order + 1,
  )?.id

  return (
    <WrapperGrid>
      <PrevWrapper>
        {!isFirstStep && (
          <ButtonPrev
            onClick={() => {
              if (prevStep) {
                setCurrentStep(prevStep)
              }
            }}
          />
        )}
      </PrevWrapper>
      <StepContents>
        <StepIndicator
          currentStepOrder={order}
          data={getStepIndicatorData(currentStep)}
          direction={undefined}
        />
        {currentStep === AddressesWhiteListStep.format && (
          <>
            {amountFormat === AddressesWhiteListAmountFormat.decimal && (
              <Note>
                <div>
                  If you are using an investment token with 6 decimals then <b>1.5</b> investment
                  token is equivalent to <b>1.5</b>.
                  <br />
                  Please input the amount as a <b>decimal</b>.
                </div>
                <div>
                  Example with <b>decimal</b> :
                </div>
                <ExampleRow>
                  <ExampleAddress>0x0000000000000000000000000000000000000000</ExampleAddress>
                  <ExampleAmount>1.5</ExampleAmount>
                </ExampleRow>
              </Note>
            )}
            {amountFormat === AddressesWhiteListAmountFormat.uint256 && (
              <Note>
                <div>
                  If you are using an investment token with 6 decimals then <b>1.5</b> investment
                  token is equivalent to <b>1500000</b>.
                  <br />
                  Please input the amount as a <b>uint256</b>.
                </div>
                <div>
                  Example with <b>uint256</b> :
                </div>
                <ExampleRow>
                  <ExampleAddress>0x0000000000000000000000000000000000000000</ExampleAddress>
                  <ExampleAmount>1500000</ExampleAmount>
                </ExampleRow>
              </Note>
            )}
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
            <Note>
              You can select a CSV file to input automatically the addresses and amounts.
              <br />
              Please avoid duplicate addresses in your CSV file.
            </Note>
            <Grid>
              <TitleGrid>
                <Title>Address</Title>
                <UploadCSV onUploadCSV={handleUploadCSV} />
              </TitleGrid>
              <Title>{`Amount (${amountFormat})`}</Title>
              <div>&nbsp;</div>
              {list.map((listItem: AddressWhitelistProps, rowIndex: number) => (
                <WhiteListRow
                  {...listItem}
                  amountFormat={amountFormat}
                  key={rowIndex}
                  onChangeRow={onChangeRow}
                  onDeleteRow={onDeleteRow}
                  rowIndex={rowIndex}
                />
              ))}
            </Grid>
            <ButtonPrimaryLightSm
              onClick={() => setList(list.concat(initialAddressesWhitelistValues))}
            >
              Add more rows
            </ButtonPrimaryLightSm>
            {getError(status)}
            <MainButton disabled={status !== AddressesWhiteListStatus.valid} onClick={handleSave}>
              Save
            </MainButton>
          </>
        )}
        <CancelButton onClick={onClose}>Cancel</CancelButton>
      </StepContents>
      <NextWrapper>
        {!isLastStep && (
          <ButtonNext
            onClick={() => {
              if (nextStep) {
                setCurrentStep(nextStep)
              }
            }}
          />
        )}
      </NextWrapper>
    </WrapperGrid>
  )
}

export default AddressesWhiteList
