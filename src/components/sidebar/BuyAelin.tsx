import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import ParentSize from '@visx/responsive/lib/components/ParentSize'

import AreaChart from './AreaChart'
import { Uniswap } from '@/src/components/assets/Uniswap'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { Chains } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div``

const Top = styled.div`
  background-color: ${({ theme: { colors } }) => colors.transparentWhite2};
  border-radius: ${({ theme: { card } }) => card.borderRadius};
  border: ${({ theme: { card } }) => card.borderColor};
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  min-height: 170px;
  padding: 16px 20px 20px;
`

const Total = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0 0 4px;
  padding: 0;
`

const Change = styled.div`
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

const getAelinUSDPrices = (): Promise<PriceData[]> => {
  return fetch(
    `https://api.coingecko.com/api/v3/coins/aelin/market_chart?vs_currency=usd&days=1&interval=hourly`,
  )
    .then((response) => response.json())
    .then((json) =>
      json.prices.map((value: number[]) => ({ date: new Date(value[0]), price: value[1] })),
    )
}

const getLastPriceFormatted = (prices: PriceData[]) => {
  if (prices.length === 0) {
    return '$0'
  }

  return `$${prices[prices.length - 1].price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

const getPriceDifferenceFormatted = (prices: PriceData[]) => {
  if (prices.length === 0) {
    return '0%'
  }

  const diff = ((prices[prices.length - 1].price - prices[0].price) / prices[0].price) * 100
  return `${diff > 0 ? '+' : ''}${diff.toFixed(2)}%`
}

const BuyAelin: React.FC = ({ ...restProps }) => {
  const [prices, setPrices] = useState<PriceData[]>([])

  useEffect(() => {
    const updatePrices = async () => {
      try {
        const prices = await getAelinUSDPrices()
        setPrices(prices)
      } catch {
        setPrices([])
      }
    }

    updatePrices()
  }, [])

  const { appChainId } = useWeb3Connection()
  const buyAelinUrl =
    appChainId === Chains.optimism
      ? 'https://app.uniswap.org/#/swap?outputCurrency=0x61BAADcF22d2565B0F471b291C475db5555e0b76&inputCurrency=ETH&chain=optimism'
      : 'https://app.uniswap.org/#/swap?outputCurrency=0xa9c125bf4c8bb26f299c00969532b66732b1f758&inputCurrency=ETH&chain=mainnet'

  return (
    <Wrapper {...restProps}>
      <Top>
        <Total>{getLastPriceFormatted(prices)}</Total>
        <Change>{getPriceDifferenceFormatted(prices)}</Change>
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
      </Top>
      <ButtonContainer>
        <GradientButton as="a" href={buyAelinUrl} target="_blank">
          <Uniswap />
          Buy Aelin
        </GradientButton>
      </ButtonContainer>
    </Wrapper>
  )
}

export default BuyAelin
