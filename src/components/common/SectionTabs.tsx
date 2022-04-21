import { useState } from 'react'
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
  onClick: (item: string) => void
  items: Array<string>
}> = ({ items, onClick, ...restProps }) => {
  const [activeItem, setActiveItem] = useState(items[0])

  const onItemClick = (value: string) => {
    setActiveItem(value)
    onClick(value)
  }

  return (
    <Wrapper {...restProps}>
      {items.map((item, index) => (
        <Item isActive={activeItem === item} key={index} onClick={() => onItemClick(item)}>
          {item}
        </Item>
      ))}
    </Wrapper>
  )
}
