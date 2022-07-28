import styled from 'styled-components'

import ParentSize from '@visx/responsive/lib/components/ParentSize'
import ms from 'ms'
import useSWR from 'swr'

import { Uniswap } from '@/src/components/assets/Uniswap'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import AreaChart from '@/src/components/sidebar/AreaChart'
import { getNetworkConfig } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import formatNumber from '@/src/utils/formatNumber'

const Wrapper = styled.div``

const AelinChart = styled.div`
  background-color: ${({ theme: { colors } }) => colors.transparentWhite2};
  border-radius: 8px;
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
  line-height: 1.4;
  margin: 0 0 4px;
  padding: 0;
`

const PriceDifferenceWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  font-weight: 500;
  line-height: 1.4;
  margin: 0 0 15px;
`

const PriceDifference = styled.div`
  color: ${({ theme: { colors } }) => colors.primary};
  font-size: 1.2rem;
  margin-right: 3px;
`

const IntervalDescription = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 0.8rem;
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
      refreshInterval: ms('1m'),
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

  const currentChainConfig = getNetworkConfig(appChainId)

  return (
    <Wrapper {...restProps}>
      {prices && prices.length > 0 && (
        <AelinChart>
          <LastPrice>{getLastPriceFormatted(prices)}</LastPrice>
          <PriceDifferenceWrapper>
            <PriceDifference>{getPriceDifferenceFormatted(prices)}</PriceDifference>
            <IntervalDescription>(last 24h)</IntervalDescription>
          </PriceDifferenceWrapper>
          <ParentSize>
            {({ width }) => (
              <AreaChart
                data={prices}
                getXValue={(data: { date: string }) => data.date}
                getYValue={(data: { price: string }) => data.price}
                height={80}
                width={width}
              />
            )}
          </ParentSize>
        </AelinChart>
      )}
      <ButtonContainer>
        <ButtonGradient
          disabled={!currentChainConfig.buyAelinUrl}
          onClick={() => {
            window.open(currentChainConfig.buyAelinUrl, '_blank')
          }}
        >
          <Uniswap />
          Buy Aelin
        </ButtonGradient>
      </ButtonContainer>
    </Wrapper>
  )
}

export default genericSuspense(BuyAelin)
