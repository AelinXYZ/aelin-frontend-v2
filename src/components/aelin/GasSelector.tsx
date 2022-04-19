import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import Wei, { wei } from '@synthetixio/wei'
import debounce from 'lodash/debounce'

import { Dropdown, DropdownItem } from '@/src/components/common/Dropdown'
import { Loading } from '@/src/components/common/Loading'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonDropdown as BaseButtonDropdown } from '@/src/components/pureStyledComponents/buttons/Button'
import { Textfield } from '@/src/components/pureStyledComponents/form/Textfield'
import { DEBOUNCED_INPUT_TIME, GWEI_PRECISION } from '@/src/constants/misc'
import useExchangeRate from '@/src/hooks/useExchangeRate'
import useEthGasPrice, { GAS_SPEEDS } from '@/src/hooks/useGasPirce'
import { getExchangeRatesForCurrencies, getTransactionPrice } from '@/src/utils/gasUtils'
import { GasLimitEstimate, GasPrices, GasSpeed } from '@/types/utils'

const ButtonDropdown = styled(BaseButtonDropdown)`
  max-width: 100%;
  width: 250px;
`

const GasSelector = ({
  gasLimitEstimate,
  initialGasSpeed = 'fast',
  onChange,
}: {
  gasLimitEstimate: GasLimitEstimate
  initialGasSpeed?: GasSpeed
  onChange: (value: Wei) => void
}) => {
  const { data: ethGasPriceData, isValidating: ethGasPriceIsValidating } = useEthGasPrice()
  const { data: exchangeRateData, isValidating: exchangeRateIsValidating } = useExchangeRate()

  const [customGasPrice, setCustomGasPrice] = useState<string>('')
  const [gasSpeed, setGasSpeed] = useState<GasSpeed>(initialGasSpeed)
  const [isOpen, setIsOpen] = useState(false)

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

  return (
    <Dropdown
      closeOnClick={false}
      dropdownButtonContent={
        <ButtonDropdown>{`Gas price (GWEI) ≈ ${formattedGasPrice} ($${transactionFee})`}</ButtonDropdown>
      }
      items={[
        <Textfield
          key="custom-gas"
          onChange={(e) => {
            setCustomGasPrice(e.target.value)
          }}
          placeholder="Or type custom gas..."
          type="number"
        />,
      ].concat(
        GAS_SPEEDS.map((gasSpeed) => (
          <DropdownItem
            key={gasSpeed}
            onClick={() => {
              setCustomGasPrice('')
              setGasSpeed(gasSpeed)
              setIsOpen(!isOpen)
            }}
          >
            {`${gasSpeed[0].toUpperCase()}${gasSpeed.slice(1)}`}:{' '}
            {Number(gasPrices[gasSpeed]).toFixed(3)}
          </DropdownItem>
        )),
      )}
    />
  )
}

export default genericSuspense(GasSelector, () => <Loading />)
