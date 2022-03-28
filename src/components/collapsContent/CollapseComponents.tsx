import React, { useState } from 'react'
import styled from 'styled-components'

import useCollapse from 'react-collapsed'

import { ArrowDown } from '@/src/components/assets/ArrowDown'
import { ArrowUp } from '@/src/components/assets/ArrowUp'

const Wrapper = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor};
  display: block;
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  &:last-child {
    border: none;
  }
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
    border: 1px solid rgba(255, 255, 255, 0.25) !important;
    &:last-child {
      margin-bottom: 20px;
    }
  }
`

const CollapseBtn = styled.p`
  width: 30px;
  height: 30px;
  display: flex;
  padding: 0;
  margin: 0;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  border: none;
  & svg {
    margin: 0 0 0 -2px;
  }
`

const Title = styled.h3`
  font-size: 1.8rem;
  margin: 0;
  padding: 0;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
`

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    margin: 0 0 20px 0;
  }
`

const CollapseComponents: React.FC<{ title: string }> = ({ children, title, ...restProps }) => {
  const [isExpanded, setExpanded] = useState(false)
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })
  return (
    <Wrapper {...restProps}>
      <Header>
        <Title> {title} </Title>

        <CollapseBtn
          {...getToggleProps({
            onClick: () => setExpanded((prevExpanded) => !prevExpanded),
          })}
        >
          {isExpanded ? <ArrowUp /> : <ArrowDown />}
        </CollapseBtn>
      </Header>

      <section {...getCollapseProps()}>{children}</section>
    </Wrapper>
  )
}

export default CollapseComponents
