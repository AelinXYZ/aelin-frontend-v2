import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { CurrencyKey } from '@synthetixio/contracts-interface'
import Wei, { wei } from '@synthetixio/wei'

import formatGwei from './formatGwai'
import { GWEI_UNIT, ZERO_BN } from '@/src/constants/misc'
import { GasLimitEstimate, Rates } from '@/types/utils'

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
  gasPriceL1: Wei | null,
  gasPrice: Wei | null,
  isL2Chain: boolean | undefined,
  gasLimit: GasLimitEstimate,
  ethPrice: Wei | undefined,
) => {
  if (!gasPrice || !gasLimit || !ethPrice || !gasPriceL1) return null

  return isL2Chain
    ? gasPrice
        .mul(ethPrice)
        .mul(gasLimit.l2)
        .div(GWEI_UNIT)
        .add(gasPriceL1.mul(ethPrice).mul(gasLimit.l1).div(GWEI_UNIT))
        .toNumber()
        .toFixed(4)
    : gasPrice.mul(ethPrice).mul(gasLimit.l1).div(GWEI_UNIT).toNumber().toFixed(4)
}

export const MIN_GAS_ESTIMATE = wei(21000, 18)

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
    fastest: gasPrice,
    fast: gasPrice,
    average: gasPrice,
  }
}

export const computeGasFee = (baseFeePerGas: BigNumber, maxPriorityFeePerGas: number) => {
  return wei(baseFeePerGas, 9).mul(wei(2)).add(wei(maxPriorityFeePerGas, 9)).toNumber()
}

export const getGasPriceEIP1559 = (baseFeePerGas: BigNumber) => ({
  fastest: computeGasFee(baseFeePerGas, 6),
  fast: computeGasFee(baseFeePerGas, 4),
  average: computeGasFee(baseFeePerGas, 2),
})
