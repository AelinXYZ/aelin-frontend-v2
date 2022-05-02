import useSWR from 'swr'

import { Chains } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import formatGwei from '@/src/utils/formatGwai'
import { GasPrices, GasSpeed } from '@/types/utils'

export const GAS_SPEEDS: GasSpeed[] = ['average', 'fast', 'fastest']

const GAS_STATION_API_URL = process.env.NEXT_PUBLIC_ETH_GAS_STATION_API_URL || ''
const GAS_NOW_API_URL = process.env.NEXT_PUBLIC_GAS_NOW_API_URL || ''

type EthGasStationResponse = {
  average: number
  avgWait: number
  blockNum: number
  block_time: number
  fast: number
  fastWait: number
  fastest: number
  fastestWait: number
  gasPriceRange: Record<number, number>
  safeLow: number
  safeLowWait: number
  speed: number
}

type GasNowResponse = {
  code: number
  data: {
    rapid: number
    fast: number
    standard: number
    slow: number
    timestamp: number
  }
}

const useEthGasPrice = () => {
  const { appChainId, readOnlyAppProvider } = useWeb3Connection()

  return useSWR<GasPrices, Error>(
    appChainId ? ['network', 'gasPrice', appChainId] : null,
    async () => {
      if (appChainId === Chains.mainnet) {
        try {
          const response = await fetch(GAS_NOW_API_URL)
          const result: GasNowResponse = await response.json()
          const { fast, rapid: fastest, standard } = result.data

          return {
            fastest: Math.round(formatGwei(fastest)),
            fast: Math.round(formatGwei(fast)),
            average: Math.round(formatGwei(standard)),
          }
        } catch (e) {
          const response = await fetch(GAS_STATION_API_URL)
          const data: EthGasStationResponse = await response.json()
          const { average, fast, fastest } = data

          return {
            fastest: Math.round(fastest / 10),
            fast: Math.round(fast / 10),
            average: Math.round(average / 10),
          }
        }
      }

      try {
        const gasPrice = formatGwei((await readOnlyAppProvider.getGasPrice()).toNumber())

        return {
          fastest: gasPrice,
          fast: gasPrice,
          average: gasPrice,
        }
      } catch (e) {
        throw new Error('Cannot retrieve gas price from provider. ' + e)
      }
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

export default useEthGasPrice
