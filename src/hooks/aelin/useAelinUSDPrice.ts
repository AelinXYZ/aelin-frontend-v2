import ms from 'ms'
import useSWR from 'swr'

export type PriceData = {
  date: Date
  price: number
}

export enum TimeInterval {
  minutely,
  hourly,
  daily,
}

const useAelinUSDPrice = (days: number, interval: TimeInterval) => {
  const { data, error } = useSWR<PriceData[]>(
    [days, interval],
    async function (days: number, interval: TimeInterval) {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/aelin/market_chart?vs_currency=usd&days=${days}&interval=${interval}`,
      )

      const json = await response.json()

      const data = json.prices.map(([date, price]: number[]) => ({
        price,
        date: new Date(date),
      }))

      return data
    },
    {
      refreshWhenHidden: false,
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshInterval: ms('1m'),
    },
  )

  return [data, error]
}

export default useAelinUSDPrice
