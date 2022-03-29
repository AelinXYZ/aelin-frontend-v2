import React from 'react'
import styled from 'styled-components'

import { Uniswap } from '@/src/components/assets/Uniswap'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'

const Wrapper = styled.div``

const GraphWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
  background-color: ${({ theme: { card } }) => card.backgroundColor};
  border-radius: ${({ theme: { card } }) => card.borderRadius};
  border: ${({ theme: { card } }) => card.borderColor};
  min-height: 170px;
  padding: 10px 20px;
`

const Total = styled.h3`
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
  padding: 0;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

const Graph: React.FC = ({ ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <GraphWrapper>
        <Total>$42,000.00</Total>

        {/* TODO select component */}
      </GraphWrapper>
      <ButtonContainer>
        <GradientButton>
          <Uniswap />
          Buy Aelins
        </GradientButton>
      </ButtonContainer>
    </Wrapper>
  )
}

export default Graph
