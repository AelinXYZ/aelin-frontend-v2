import React from 'react'
import styled from 'styled-components'

import ParentSize from '@visx/responsive/lib/components/ParentSize'
import useSWR from 'swr'

import { Uniswap } from '@/src/components/assets/Uniswap'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import AreaChart from '@/src/components/sidebar/AreaChart'
import { Chains } from '@/src/constants/chains'
import { ONE_MINUTE_IN_SECS } from '@/src/constants/time'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import formatNumber from '@/src/utils/formatNumber'

const Wrapper = styled.div``

const AelinChart = styled.div`
  background-color: ${({ theme: { colors } }) => colors.transparentWhite2};
  border-radius: ${({ theme: { card } }) => card.borderRadius};
  border: ${({ theme: { card } }) => card.borderColor};
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  min-height: 170px;
  padding: 16px 20px 20px;
`

const LastPrice = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0 0 4px;
  padding: 0;
`

const PriceDifference = styled.div`
  color: ${({ theme: { colors } }) => colors.primary};
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 1.2;
  margin: 0 0 15px;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

type PriceData = {
  date: Date
  price: number
}

type TimeInterval = 'minutely' | 'hourly' | 'daily'

const useAelinUSDPrices = (days: number, interval: TimeInterval) => {
  const { data } = useSWR<PriceData[]>(
    [days, interval],
    async function (days: number, interval: TimeInterval) {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/aelin/market_chart?vs_currency=usd&days=${days}&interval=${interval}`,
      )
      const json = await response.json()
      const data = json.prices.map((value: number[]) => ({
        date: new Date(value[0]),
        price: value[1],
      }))

      return data
    },
    {
      refreshWhenHidden: false,
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshInterval: ONE_MINUTE_IN_SECS * 1000,
    },
  )

  return data
}

const getLastPriceFormatted = (prices: PriceData[]) => {
  return `$${formatNumber(prices[prices.length - 1].price)}`
}

const getPriceDifferenceFormatted = (prices: PriceData[]) => {
  const diff = ((prices[prices.length - 1].price - prices[0].price) / prices[0].price) * 100
  return `${diff > 0 ? '+' : ''}${diff.toFixed(2)}%`
}

const BuyAelin: React.FC = ({ ...restProps }) => {
  const prices = useAelinUSDPrices(1, 'hourly')

  const { appChainId } = useWeb3Connection()

  const buyAelinUrl =
    appChainId === Chains.optimism
      ? 'https://app.uniswap.org/#/swap?outputCurrency=0x61BAADcF22d2565B0F471b291C475db5555e0b76&inputCurrency=ETH&chain=optimism'
      : 'https://app.uniswap.org/#/swap?outputCurrency=0xa9c125bf4c8bb26f299c00969532b66732b1f758&inputCurrency=ETH&chain=mainnet'

  return (
    <Wrapper {...restProps}>
      {prices && prices.length > 0 && (
        <AelinChart>
          <LastPrice>{getLastPriceFormatted(prices)}</LastPrice>
          <PriceDifference>{getPriceDifferenceFormatted(prices)}</PriceDifference>
          <ParentSize>
            {({ width }) => (
              <AreaChart
                data={prices}
                getXValue={(data) => data.date}
                getYValue={(data) => data.price}
                height={80}
                width={width}
              />
            )}
          </ParentSize>
        </AelinChart>
      )}
      <ButtonContainer>
        <GradientButton as="a" href={buyAelinUrl} target="_blank">
          <Uniswap />
          Buy Aelin
        </GradientButton>
      </ButtonContainer>
    </Wrapper>
  )
}

export default genericSuspense(BuyAelin)
