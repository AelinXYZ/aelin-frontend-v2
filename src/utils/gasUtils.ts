import { CurrencyKey } from '@synthetixio/contracts-interface'
import Wei, { wei } from '@synthetixio/wei'

import { GWEI_UNIT } from '@/src/constants/misc'
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
  gasPrice: Wei | null,
  gasLimit: GasLimitEstimate,
  ethPrice: Wei | undefined,
) => {
  if (!gasPrice || !gasLimit || !ethPrice) return null
  return gasPrice.mul(ethPrice).mul(gasLimit).div(GWEI_UNIT).toNumber().toFixed(4)
}

export const MIN_GAS_ESTIMATE = wei(21000, 18)

export const getGasEstimateWithBuffer = (gasEstimate: GasLimitEstimate) => {
  if (!gasEstimate) return null
  const estimateWithBuffer = gasEstimate?.add(
    gasEstimate?.mul(wei(GAS_LIMIT_BUFFER_MULTIPLIER, 0)).div(100),
  )

  return estimateWithBuffer.gt(MIN_GAS_ESTIMATE) ? estimateWithBuffer : undefined
}
