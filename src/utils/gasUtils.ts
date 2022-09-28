import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { CurrencyKey } from '@synthetixio/contracts-interface'
import Wei, { wei } from '@synthetixio/wei'

import formatGwei from './formatGwei'
import { BASE_DECIMALS, GWEI_UNIT, ZERO_BN } from '@/src/constants/misc'
import { Eip1559GasPrice, GasLimitEstimate, Rates } from '@/types/utils'

export const iStandardSynth = (currencyKey: CurrencyKey) => currencyKey.startsWith('s')
export const synthToAsset = (currencyKey: CurrencyKey) =>
  currencyKey.replace(/^(i|s)/i, '') as CurrencyKey

export const getExchangeRatesForCurrencies = (
  rates: Rates | undefined,
  base: CurrencyKey | null,
  quote: CurrencyKey | null,
) => (rates == null || base == null || quote == null ? wei(0) : rates[base].div(rates[quote]))

const GAS_LIMIT_BUFFER_MULTIPLIER = 20

export const getTransactionPrice = (
  gasPriceL1: Eip1559GasPrice | Wei | null,
  gasPrice: Eip1559GasPrice | Wei | null,
  isL2Chain: boolean | undefined,
  gasLimit: GasLimitEstimate,
  ethPrice: Wei | undefined,
) => {
  if (!gasPrice || !gasLimit || !ethPrice || !gasPriceL1) return null

  if (isL2Chain) {
    return (gasPrice as Wei)
      .mul(ethPrice)
      .mul(gasLimit.l2)
      .div(GWEI_UNIT)
      .add((gasPriceL1 as Wei).mul(ethPrice).mul(gasLimit.l1).div(GWEI_UNIT))
      .toNumber()
      .toFixed(4)
  }

  if (gasPrice instanceof Wei) {
    return gasPrice.mul(ethPrice).mul(gasLimit.l1).div(GWEI_UNIT).toNumber().toFixed(4)
  }

  return gasPrice.maxFeePerGas
    .add(gasPrice.maxPriorityFeePerGas)
    .mul(ethPrice)
    .mul(gasLimit.l1)
    .div(GWEI_UNIT)
    .toNumber()
    .toFixed(4)
}

export const MIN_GAS_ESTIMATE = wei(21000, BASE_DECIMALS)

export const getGasEstimateWithBuffer = (gasEstimate: GasLimitEstimate) => {
  if (!gasEstimate) return undefined

  const { l1: gasEstimateL1, l2: gasEstimateL2 } = gasEstimate
  const estimateWithBufferL1 = gasEstimateL1.add(
    gasEstimateL1.mul(wei(GAS_LIMIT_BUFFER_MULTIPLIER, 0)).div(100),
  )

  const estimateWithBufferL2 = gasEstimateL2?.add(
    gasEstimateL2?.mul(wei(GAS_LIMIT_BUFFER_MULTIPLIER, 0)).div(100),
  )

  const gasEstimateL1Buffer = estimateWithBufferL1.gt(MIN_GAS_ESTIMATE)
    ? estimateWithBufferL1.toBN()
    : undefined
  const gasEstimateL2Buffer = estimateWithBufferL2?.gt(MIN_GAS_ESTIMATE)
    ? estimateWithBufferL2.toBN()
    : undefined

  return gasEstimateL1Buffer ? gasEstimateL1Buffer.add(gasEstimateL2Buffer ?? ZERO_BN) : undefined
}

export const getGasPriceFromProvider = async (provider: JsonRpcProvider) => {
  const gasPrice = formatGwei((await provider.getGasPrice()).toNumber())

  return {
    aggressive: gasPrice,
    market: gasPrice,
    low: gasPrice,
  }
}

export const getGasPriceEIP1559 = (baseFeePerGas: BigNumber) => ({
  low: {
    maxFeePerGas: wei(baseFeePerGas, 9).mul(wei(1)),
    maxPriorityFeePerGas: wei(1, 9),
  },
  market: {
    maxFeePerGas: wei(baseFeePerGas, 9).mul(wei(1.5)),
    maxPriorityFeePerGas: wei(1.5, 9),
  },
  aggressive: {
    maxFeePerGas: wei(baseFeePerGas, 9).mul(wei(2)),
    maxPriorityFeePerGas: wei(2, 9),
  },
})
