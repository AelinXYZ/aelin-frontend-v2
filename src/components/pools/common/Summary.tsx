import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  border: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  grid-template-rows: auto auto;
  padding: 20px;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    grid-auto-flow: column;
  }
`

const Cell = styled.div``

const Title = styled.h4`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 4px;
`

const Value = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.3;
  margin: 0;
`

export const SummaryItem: React.FC<{
  title: string
  value: string | JSX.Element
}> = ({ title, value }) => (
  <Cell>
    <Title>{title}</Title>
    <Value>{value}</Value>
  </Cell>
)

interface Props {
  data: { title: string; value: string | JSX.Element }[]
}

export const Summary: React.FC<Props> = ({ data, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      {data.map((item, index) => {
        return <SummaryItem key={index} {...item} />
      })}
    </Wrapper>
  )
}
