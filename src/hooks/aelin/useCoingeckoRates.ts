import useSWR from 'swr'

type AelinRatesResponse = {
  aelin: { usd: number }
  ethereum: { usd: number }
}

export type UseCoingeckoRatesResponse = {
  aelinRate: number
  ethRate: number
}

const getAelinETHRates = (): Promise<AelinRatesResponse> => {
  return fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=aelin%2Cethereum&vs_currencies=usd`,
  ).then((r) => r.json())
}

export const useCoingeckoRates = () => {
  return useSWR(['AELIN-ETH-Rate'], async () => {
    const response: AelinRatesResponse = await getAelinETHRates()
    const { usd: aelinRate } = response.aelin
    const { usd: ethRate } = response.ethereum

    return { aelinRate, ethRate }
  })
}
