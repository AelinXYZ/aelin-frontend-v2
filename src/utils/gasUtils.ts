import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { CurrencyKey } from '@synthetixio/contracts-interface'
import Wei, { wei } from '@synthetixio/wei'

import { Chains, ChainsValues } from '../constants/chains'
import { BASE_DECIMALS, GWEI_UNIT, ZERO_BN } from '@/src/constants/misc'
import formatGwei from '@/src/utils/formatGwei'
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
  gasPrice: Eip1559GasPrice | Wei | null,
  gasEstimate: GasLimitEstimate,
  gasCurrencyPrice: Wei | undefined,
) => {
  if (!gasPrice || !gasEstimate || !gasCurrencyPrice) return null

  if (gasPrice instanceof Wei) {
    return gasPrice
      .mul(gasCurrencyPrice)
      .mul(gasEstimate.gasLimit)
      .div(GWEI_UNIT)
      .toNumber()
      .toFixed(4)
  }
  const totalGasPrice = gasPrice.maxFeePerGas.add(gasPrice.maxPriorityFeePerGas)
  const gasPriceCost = totalGasPrice.mul(gasCurrencyPrice).mul(gasEstimate.gasLimit).div(GWEI_UNIT)
  const l1Cost = gasCurrencyPrice.mul(gasEstimate.l1Fee || 0)

  return gasPriceCost.add(l1Cost).toNumber().toFixed(4)
}

export const MIN_GAS_ESTIMATE = wei(21000, BASE_DECIMALS)

export const getGasEstimateWithBuffer = (gasLimit: Wei) => {
  if (!gasLimit) return undefined
  return gasLimit?.add(gasLimit?.mul(wei(GAS_LIMIT_BUFFER_MULTIPLIER, 0)).div(100)).toBN() ?? null
}

export const getGasPriceFromProvider = async (provider: JsonRpcProvider) => {
  const gasPrice = formatGwei((await provider.getGasPrice()).toNumber())

  return {
    aggressive: gasPrice,
    market: gasPrice,
    low: gasPrice,
  }
}

export const getGasPriceEIP1559 = (baseFeePerGas: BigNumber, appChainId: ChainsValues) => {
  switch (appChainId) {
    case Chains.mainnet:
    case Chains.goerli:
    case Chains.sepolia:
      return {
        low: {
          maxFeePerGas: wei(baseFeePerGas, 9),
          maxPriorityFeePerGas: wei(1, 9),
        },
        market: {
          maxFeePerGas: wei(baseFeePerGas, 9).mul(wei(1.5, 9)),
          maxPriorityFeePerGas: wei(1.5, 9),
        },
        aggressive: {
          maxFeePerGas: wei(baseFeePerGas, 9).mul(wei(2, 9)),
          maxPriorityFeePerGas: wei(2, 9),
        },
      }
    case Chains.optimism:
      return {
        low: {
          maxFeePerGas: wei(baseFeePerGas, 9),
          maxPriorityFeePerGas: wei(9, undefined, true),
        },
        market: {
          maxFeePerGas: wei(baseFeePerGas, 9).mul(wei(1.5, 9)),
          maxPriorityFeePerGas: wei(14, undefined, true),
        },
        aggressive: {
          maxFeePerGas: wei(baseFeePerGas, 9).mul(wei(2, 9)),
          maxPriorityFeePerGas: wei(18, undefined, true),
        },
      }
    case Chains.polygon:
      return {
        low: {
          maxFeePerGas: wei(baseFeePerGas, 9).mul(wei(2)).add(wei(30, 9)),
          maxPriorityFeePerGas: wei(30, 9),
        },
        market: {
          maxFeePerGas: wei(baseFeePerGas, 9).mul(wei(2)).add(wei(31, 9)),
          maxPriorityFeePerGas: wei(31, 9),
        },
        aggressive: {
          maxFeePerGas: wei(baseFeePerGas, 9).mul(wei(2)).add(wei(32, 9)),
          maxPriorityFeePerGas: wei(32, 9),
        },
      }
    case Chains.arbitrum:
      return {
        low: {
          maxFeePerGas: wei(baseFeePerGas, 9).mul(wei(1)),
          maxPriorityFeePerGas: wei(0, 9),
        },
        market: {
          maxFeePerGas: wei(baseFeePerGas, 9).mul(wei(1.35)),
          maxPriorityFeePerGas: wei(0, 9),
        },
        aggressive: {
          maxFeePerGas: wei(baseFeePerGas, 9).mul(wei(1.7)),
          maxPriorityFeePerGas: wei(0, 9),
        },
      }
    default:
      throw new Error('Unsupported network.')
  }
}
