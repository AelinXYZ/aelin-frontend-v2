import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import Wei, { wei } from '@synthetixio/wei'
import debounce from 'lodash/debounce'

import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { Dropdown, DropdownItem, DropdownPosition } from '@/src/components/common/Dropdown'
import { Loading } from '@/src/components/common/Loading'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonPrimaryLight } from '@/src/components/pureStyledComponents/buttons/Button'
import { chainsConfig } from '@/src/constants/chains'
import { DEBOUNCED_INPUT_TIME, GWEI_PRECISION } from '@/src/constants/misc'
import useEthGasPrice, { GAS_SPEEDS, useEthGasPriceLegacy } from '@/src/hooks/useGasPrice'
import useGasPriceUnitInUSD from '@/src/hooks/useGasPriceUnitInUSD'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getTransactionPrice } from '@/src/utils/gasUtils'
import { Eip1559GasPrice, GasLimitEstimate, GasSpeed } from '@/types/utils'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const Text = styled.span`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 0.9rem;
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
  font-size: 0.8rem;
  font-weight: 400;
  height: 24px;
  margin-left: 10px;
  padding-left: 15px;
  padding-right: 15px;
`

const GasSelector = ({
  gasEstimate,
  initialGasSpeed = 'market',
  onChange,
  setLoadingGas,
  ...restProps
}: {
  gasEstimate: GasLimitEstimate
  initialGasSpeed?: GasSpeed
  onChange: (value: Wei | Eip1559GasPrice) => void
  setLoadingGas: (value: boolean) => void
}) => {
  const { data: ethGasPriceData, isValidating } = useEthGasPrice()
  const { data: ethGasPriceDataLegacy, isValidating: isValidatingLegacy } = useEthGasPriceLegacy()
  const { data: gasCurrencyPrice } = useGasPriceUnitInUSD()

  const { appChainId } = useWeb3Connection()

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [customGasPrice, setCustomGasPrice] = useState<string>('')

  const [gasSpeed, setGasSpeed] = useState<GasSpeed>(initialGasSpeed)

  const isL2Chain = !!chainsConfig[appChainId]?.isL2

  const ethGasPriceDataL1 = ethGasPriceData?.l1
  const ethGasPriceDataL2 = ethGasPriceData?.l2

  const gasPrices = useMemo(
    () => (isL2Chain ? ethGasPriceDataL2 : ethGasPriceDataL1),
    [ethGasPriceDataL1, ethGasPriceDataL2, isL2Chain],
  )

  const gasPriceL1: Eip1559GasPrice | Wei | null = useMemo(() => {
    if (!ethGasPriceDataL1 || !ethGasPriceDataLegacy) return null

    const getL1gasPrice = () => {
      try {
        return wei(ethGasPriceDataL1[gasSpeed], GWEI_PRECISION)
      } catch (_) {
        return ethGasPriceDataL1[gasSpeed] as Eip1559GasPrice
      }
    }

    return isL2Chain ? wei(ethGasPriceDataLegacy[gasSpeed], GWEI_PRECISION) : getL1gasPrice()
  }, [ethGasPriceDataL1, ethGasPriceDataLegacy, gasSpeed, isL2Chain])

  const renderGasPrices = (gasPrice?: number | Eip1559GasPrice) => {
    if (!gasPrice) {
      return 0
    }

    if (isL2Chain || typeof gasPrice === 'number') {
      return (gasPrice as number).toFixed(3)
    }

    return Number(gasPrice.maxFeePerGas).toFixed(3)
  }

  const gasPrice: Eip1559GasPrice | Wei | null = useMemo(() => {
    try {
      return wei(customGasPrice, GWEI_PRECISION)
    } catch (_) {
      if (!ethGasPriceDataL2 || !isL2Chain) return gasPriceL1

      const getL2gasPrice = () => {
        try {
          return wei(ethGasPriceDataL2[gasSpeed], GWEI_PRECISION)
        } catch (_) {
          return ethGasPriceDataL2[gasSpeed] as Eip1559GasPrice
        }
      }

      return getL2gasPrice()
    }
  }, [customGasPrice, gasPriceL1, ethGasPriceDataL2, gasSpeed, isL2Chain])

  const transactionFeeInUSD = useMemo(
    () => getTransactionPrice(gasPrice, gasEstimate, gasCurrencyPrice) ?? 0,
    [gasPrice, gasEstimate, gasCurrencyPrice],
  )

  const formattedGasPrice = useMemo(() => {
    let nGasPrice

    if (!gasPrices?.[gasSpeed]) {
      nGasPrice = 0
    } else if (typeof gasPrices[gasSpeed] === 'number') {
      nGasPrice = gasPrices[gasSpeed] as number
    } else {
      const gasPrice = gasPrices[gasSpeed] as Eip1559GasPrice
      nGasPrice = Number(gasPrice.maxFeePerGas)
    }

    const nCustomGasPrice = Number(customGasPrice)

    if (!nCustomGasPrice) {
      if (nGasPrice >= 1) return nGasPrice.toFixed(3)
      return nGasPrice.toFixed(8)
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

  const onEdit = () => {
    setIsEditing(true)

    if (inputRef.current) {
      inputRef.current?.focus()
    }
  }

  useEffect(() => {
    setLoadingGas(!customGasPrice && !isEditing ? isValidating || isValidatingLegacy : false)
  }, [customGasPrice, isEditing, isValidating, isValidatingLegacy, setLoadingGas])

  return (
    <Wrapper {...restProps}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Text>Max Fee:</Text>&nbsp;
        <GasInput
          onBlur={() => {
            setIsEditing(false)
          }}
          onChange={(e) => {
            setCustomGasPrice(e.target.value)
          }}
          onKeyUp={(event) => {
            if (event.code === 'Enter') {
              setIsEditing(false)
            }
          }}
          readOnly={!isEditing}
          ref={inputRef}
          type="number"
          value={isEditing ? customGasPrice : formattedGasPrice}
        />
        {!isL2Chain && (
          <Dropdown
            currentItem={GAS_SPEEDS.findIndex((speed) => speed === gasSpeed)}
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
                {renderGasPrices(gasPrices?.[gasSpeed])}
              </DropdownItem>
            ))}
          />
        )}
        {!isL2Chain && <EditButton onClick={onEdit}>Edit</EditButton>}
      </div>
      <div style={{ marginTop: '5px' }}>
        <Text>Price:</Text>&nbsp;
        <DollarValue>${transactionFeeInUSD}</DollarValue>
      </div>
    </Wrapper>
  )
}

export default genericSuspense(GasSelector, () => <Loading />)
