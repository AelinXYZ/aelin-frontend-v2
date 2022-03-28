import React, { useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor};
  display: block;
  text-align: center;
  min-height: 170px;
  margin-top: 20px;
  background-color: ${(props) => props.theme.card.backgroundColor};
  border-radius: ${({ theme }) => theme.card.borderRadius};
  border: ${(props) => props.theme.card.borderColor};
  padding: 10px 20px;
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    background-color: ${(props) => props.theme.card.backgroundColor};
    border-radius: ${({ theme }) => theme.card.borderRadius};
    border: ${(props) => props.theme.card.borderColor};
    padding: 20px;
    margin: 10px 0 10px 10px;
  }
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    margin: 10px;
    padding-bottom: 0;
  }
`

const FlexCont = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    margin: 0 0 20px 0;
  }
`

const Total = styled.h3`
  font-size: 1.6rem;
  margin: 0;
  padding: 0;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
`

const GraphComponent: React.FC = ({ ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <FlexCont>
        <Total>$42,000.00</Total>

        {/* TODO select component */}
      </FlexCont>
    </Wrapper>
  )
}

export default GraphComponent
