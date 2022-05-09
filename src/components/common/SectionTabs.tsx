import React, { useState } from 'react'
import styled, { css } from 'styled-components'

import { ButtonPrimaryLighter } from '@/src/components/pureStyledComponents/buttons/Button'

const Wrapper = styled.div`
  column-gap: 20px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  row-gap: 10px;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    flex-direction: row;
  }
`

const ActiveItemCSS = css`
  &,
  &:hover {
    border-color: ${({ theme: { colors } }) => colors.primary};
    color: ${({ theme: { colors } }) => colors.primary};
    cursor: default;
    pointer-events: none;
  }
`

const Item = styled(ButtonPrimaryLighter)<{ isActive?: boolean }>`
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
