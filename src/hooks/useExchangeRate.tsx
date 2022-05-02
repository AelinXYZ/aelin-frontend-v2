import { BigNumberish } from '@ethersproject/bignumber'
import { parseBytes32String } from '@ethersproject/strings'
import { formatEther } from '@ethersproject/units'
import synthetix, { CurrencyKey } from '@synthetixio/contracts-interface'
import Wei, { wei } from '@synthetixio/wei'
import useSWR from 'swr'

import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { iStandardSynth, synthToAsset } from '@/src/utils/gasUtils'

type Rates = Record<string, Wei>
type CurrencyRate = BigNumberish
type SynthRatesTuple = [string[], CurrencyRate[]]

const useExchangeRates = () => {
  const { appChainId } = useWeb3Connection()

  const snxjs = synthetix({ network: 'mainnet' })

  return useSWR<Rates>(
    ['rates', 'exchangeRates', appChainId],
    async () => {
      const exchangeRates: Rates = {}

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

      return exchangeRates
    },
    {
      refreshWhenHidden: false,
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshInterval: 10000,
    },
  )
}

export default useExchangeRates
