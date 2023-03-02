import styled from 'styled-components'

import ParentSize from '@visx/responsive/lib/components/ParentSize'

import { Uniswap } from '@/src/components/assets/Uniswap'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import AreaChart from '@/src/components/sidebar/AreaChart'
import { getNetworkConfig } from '@/src/constants/chains'
import { DISPLAY_DECIMALS } from '@/src/constants/misc'
import useAelinUSDPrice, { PriceData, TimeInterval } from '@/src/hooks/aelin/useAelinUSDPrice'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { formatNumber } from '@/src/utils/formatNumber'

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
  font-size: 1rem;
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
  font-size: 0.8rem;
  margin-right: 3px;
`

const IntervalDescription = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 0.6rem;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

const getLastPriceFormatted = (prices: PriceData[]) => {
  return `$${formatNumber(prices[prices.length - 1].price, DISPLAY_DECIMALS)}`
}

const getPriceDifferenceFormatted = (prices: PriceData[]) => {
  const diff = ((prices[prices.length - 1].price - prices[0].price) / prices[0].price) * 100
  return `${diff > 0 ? '+' : ''}${diff.toFixed(DISPLAY_DECIMALS)}%`
}

const BuyAelin = ({ ...restProps }) => {
  const days = 1

  const [prices, error] = useAelinUSDPrice(days, TimeInterval.hourly)

  const { appChainId } = useWeb3Connection()

  const currentChainConfig = getNetworkConfig(appChainId)

  if (error) {
    console.error(error)
    throw new Error(`Cannot fetch Aelin's price`)
  }

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
