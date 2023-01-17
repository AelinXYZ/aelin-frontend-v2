import { BigNumberish } from '@ethersproject/bignumber'
import { parseBytes32String } from '@ethersproject/strings'
import { formatEther } from '@ethersproject/units'
import synthetix, { CurrencyKey } from '@synthetixio/contracts-interface'
import Wei, { wei } from '@synthetixio/wei'
import ms from 'ms'
import useSWR from 'swr'

import { mainnetRpcProvider, optimismRpcProvider } from './useEnsResolvers'
import { getExchangeRatesForCurrencies, iStandardSynth, synthToAsset } from '@/src/utils/gasUtils'

type Rates = Record<string, Wei>
type CurrencyRate = BigNumberish
type SynthRatesTuple = [string[], CurrencyRate[]]

export enum GasPriceUnit {
  eth,
  matic,
}

const useGasPriceUnitInUSD = (gasPriceUnit: GasPriceUnit) => {
  const snxjs = synthetix({
    network: gasPriceUnit === GasPriceUnit.eth ? 'mainnet' : 'mainnet-ovm',
    provider: gasPriceUnit === GasPriceUnit.eth ? mainnetRpcProvider : optimismRpcProvider,
  })

  return useSWR<Wei>(
    ['rates', 'exchangeRates', gasPriceUnit],
    async () => {
      const exchangeRates: Rates = {}

      // @TODO issue #255
      const synthsRates: SynthRatesTuple = await snxjs.contracts.SynthUtil.synthsRates()

      const synths = [...synthsRates[0]] as CurrencyKey[]
      const rates = [...synthsRates[1]] as CurrencyRate[]

      synths.forEach((currencyKeyBytes32: CurrencyKey, idx: number) => {
        const currencyKey = parseBytes32String(currencyKeyBytes32) as CurrencyKey
        const rate = Number(formatEther(rates[idx]))

        exchangeRates[currencyKey] = wei(rate)
        // only interested in the standard synths (sETH -> ETH, etc)
        if (iStandardSynth(currencyKey)) {
          exchangeRates[synthToAsset(currencyKey)] = wei(rate)
        }
      })

      return getExchangeRatesForCurrencies(
        exchangeRates,
        gasPriceUnit === GasPriceUnit.eth ? 'sETH' : 'sMATIC',
        'sUSD',
      )
    },
    {
      refreshInterval: ms('2m'),
      suspense: false,
    },
  )
}

export default useGasPriceUnitInUSD
