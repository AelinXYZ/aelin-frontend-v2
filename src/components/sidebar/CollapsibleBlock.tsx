import React, { useState } from 'react'
import styled from 'styled-components'

import useCollapse from 'react-collapsed'

import { ArrowDown } from '@/src/components/assets/ArrowDown'
import { ArrowUp } from '@/src/components/assets/ArrowUp'

const Wrapper = styled.div`
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  color: ${({ theme: { colors } }) => colors.textColor};
  margin-bottom: 20px;
  text-align: center;

  &:last-child {
    border: none;
  }

  @media (max-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    background-color: ${(props) => props.theme.card.backgroundColor};
    border-radius: ${({ theme }) => theme.card.borderRadius};
    border: ${(props) => props.theme.card.borderColor};
    margin: 10px 0 10px 10px;
    padding: 20px;
  }

  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    border: 1px solid rgba(255, 255, 255, 0.25) !important;
    margin: 10px;
    padding-bottom: 0;

    &:last-child {
      margin-bottom: 20px;
    }
  }
`

const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    margin: 0 0 20px 0;
  }
`

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  padding: 0;
`

const CollapseButton = styled.button`
  --dimensions: 30px;

  align-items: center;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  border: none;
  display: flex;
  height: var(--dimensions);
  justify-content: center;
  margin: 0;
  padding: 0;
  width: var(--dimensions);

  & svg {
    margin: 0 0 0 -2px;
  }
`

const CollapsibleBlock: React.FC<{ title: string }> = ({ children, title, ...restProps }) => {
  const [isExpanded, setExpanded] = useState(true)
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })

  return (
    <Wrapper {...restProps}>
      <Header>
        <Title> {title} </Title>
        <CollapseButton
          {...getToggleProps({
            onClick: () => setExpanded((prevExpanded) => !prevExpanded),
          })}
        >
          {isExpanded ? <ArrowUp /> : <ArrowDown />}
        </CollapseButton>
      </Header>
      <section {...getCollapseProps()}>{children}</section>
    </Wrapper>
  )
}

export default CollapsibleBlock
