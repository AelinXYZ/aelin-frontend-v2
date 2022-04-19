import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import Wei, { wei } from '@synthetixio/wei'
import debounce from 'lodash/debounce'

import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { Dropdown, DropdownItem, DropdownPosition } from '@/src/components/common/Dropdown'
import { Loading } from '@/src/components/common/Loading'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonPrimaryLight } from '@/src/components/pureStyledComponents/buttons/Button'
import { DEBOUNCED_INPUT_TIME, GWEI_PRECISION } from '@/src/constants/misc'
import useExchangeRate from '@/src/hooks/useExchangeRate'
import useEthGasPrice, { GAS_SPEEDS } from '@/src/hooks/useGasPirce'
import { getExchangeRatesForCurrencies, getTransactionPrice } from '@/src/utils/gasUtils'
import { GasLimitEstimate, GasPrices, GasSpeed } from '@/types/utils'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
`

const Text = styled.span`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
`

const ValueCSS = css`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`

const GasInput = styled.input`
  ${ValueCSS}
  background-color: transparent;
  border: none;
  padding: 0;
  outline: none;
  text-align: right;
  width: 50px;

  &[readonly] {
    cursor: default;
  }

  -moz-appearance: textfield;
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const DollarValue = styled.span`
  ${ValueCSS}
  margin-left: 3px;
`

const ButtonDropdown = styled.button`
  --dimensions: 30px;

  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  height: var(--dimensions);
  justify-content: center;
  width: var(--dimensions);

  transition: opacity 0.15s linear;

  &:active {
    opacity: 0.7;
  }
`

const EditButton = styled(ButtonPrimaryLight)`
  font-size: 1rem;
  font-weight: 400;
  height: 24px;
  margin-left: 10px;
  padding-left: 15px;
  padding-right: 15px;
`

const GasSelector = ({
  gasLimitEstimate,
  initialGasSpeed = 'fast',
  onChange,
  ...restProps
}: {
  gasLimitEstimate: GasLimitEstimate
  initialGasSpeed?: GasSpeed
  onChange: (value: Wei) => void
}) => {
  const { data: ethGasPriceData, isValidating: ethGasPriceIsValidating } = useEthGasPrice()
  const { data: exchangeRateData, isValidating: exchangeRateIsValidating } = useExchangeRate()

  const [gasSpeed, setGasSpeed] = useState<GasSpeed>(initialGasSpeed)
  const [customGasPrice, setCustomGasPrice] = useState<string>('')

  const gasPrices = useMemo(() => ethGasPriceData ?? ({} as GasPrices), [ethGasPriceData])
  const isValidating = ethGasPriceIsValidating || exchangeRateIsValidating

  const gasPrice: Wei | null = useMemo(() => {
    try {
      return wei(customGasPrice, GWEI_PRECISION)
    } catch (_) {
      if (!ethGasPriceData) return null

      return wei(ethGasPriceData[gasSpeed], GWEI_PRECISION)
    }
  }, [customGasPrice, ethGasPriceData, gasSpeed])

  const ethPriceRate = getExchangeRatesForCurrencies(exchangeRateData, 'sETH', 'sUSD')

  const transactionFee = useMemo(
    () => getTransactionPrice(gasPrice, gasLimitEstimate, ethPriceRate) ?? 0,
    [gasPrice, gasLimitEstimate, ethPriceRate],
  )

  const formattedGasPrice = useMemo(() => {
    const nGasPrice = Number(gasPrices[gasSpeed] ?? 0)
    const nCustomGasPrice = Number(customGasPrice)

    if (!nCustomGasPrice) {
      if (!Number.isInteger(nGasPrice)) return nGasPrice.toFixed(3)
      return nGasPrice
    }

    if (!Number.isInteger(nCustomGasPrice)) return nCustomGasPrice.toFixed(3)
    return nCustomGasPrice
  }, [customGasPrice, gasPrices, gasSpeed])

  const debouncedChangeHandler = debounce(onChange, DEBOUNCED_INPUT_TIME)

  useEffect(() => {
    try {
      debouncedChangeHandler(wei(customGasPrice, GWEI_PRECISION))
    } catch (_) {
      debouncedChangeHandler(gasPrice || wei(0))
    }
    // eslint-disable-next-line
  }, [gasPrice, customGasPrice])

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onEdit = () => {
    setIsEditing(true)

    if (inputRef.current) {
      inputRef.current?.focus()
    }
  }

  return (
    <Wrapper {...restProps}>
      <Text>Gas Price:</Text>&nbsp;
      <GasInput
        disabled={isValidating}
        onBlur={() => {
          setIsEditing(false)
        }}
        onChange={(e) => {
          setCustomGasPrice(e.target.value)
        }}
        readOnly={!isEditing}
        ref={inputRef}
        type="number"
        value={isEditing ? customGasPrice : formattedGasPrice}
      />
      &nbsp;
      <DollarValue>(${transactionFee})</DollarValue>
      <Dropdown
        dropdownButtonContent={
          <ButtonDropdown>
            <ChevronDown />
          </ButtonDropdown>
        }
        dropdownPosition={DropdownPosition.right}
        items={GAS_SPEEDS.map((gasSpeed) => (
          <DropdownItem
            key={gasSpeed}
            onClick={() => {
              setCustomGasPrice('')
              setIsEditing(false)
              setGasSpeed(gasSpeed)
            }}
          >
            {`${gasSpeed[0].toUpperCase()}${gasSpeed.slice(1)}`}:{' '}
            {Number(gasPrices[gasSpeed]).toFixed(3)}
          </DropdownItem>
        ))}
      />
      <EditButton onClick={onEdit}>Edit</EditButton>
    </Wrapper>
  )
}

export default genericSuspense(GasSelector, () => <Loading />)
