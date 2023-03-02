import React, { useState } from 'react'
import styled, { css } from 'styled-components'

import { ButtonPrimaryLighter } from '@/src/components/pureStyledComponents/buttons/Button'

const Wrapper = styled.div`
  column-gap: 12px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 20px;
  row-gap: 10px;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    column-gap: 20px;
  }
`

const ActiveItemCSS = css`
  &,
  &:hover {
    background-color: rgba(130, 128, 255, 0.08);
    border-color: ${({ theme: { colors } }) => colors.primary};
    color: ${({ theme: { colors } }) => colors.primary};
    cursor: default;
    pointer-events: none;
  }
`

const Item = styled(ButtonPrimaryLighter)<{ isActive?: boolean }>`
  height: 24px;
  padding: 0 10px;
  font-size: 0.7rem;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    font-size: 0.9rem;
    height: 36px;
    padding: 0 20px;
  }

  ${({ isActive }) => isActive && ActiveItemCSS}
`

Item.defaultProps = {
  isActive: false,
}

export const SectionTabs: React.FC<{
  items: Array<{ value: string; key: string; children: React.ReactNode }>
}> = ({ items, ...restProps }) => {
  const [activeItem, setActiveItem] = useState(items[0].key)

  const onItemClick = (key: string) => {
    setActiveItem(key)
  }

  const index = items.findIndex(({ key }) => key === activeItem)

  return (
    <>
      <Wrapper {...restProps}>
        {items.map(({ key, value }) => (
          <Item isActive={activeItem === key} key={key} onClick={() => onItemClick(key)}>
            {value}
          </Item>
        ))}
      </Wrapper>
      {items[index].children}
    </>
  )
}
