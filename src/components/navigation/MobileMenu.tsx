import styled from 'styled-components'

import { NavLink } from '@/src/components/navigation/NavLink'
import { sections } from '@/src/constants/sections'

const Wrapper = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.mobileMenu.backgroundColor};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  bottom: 0;
  column-gap: 10px;
  display: flex;
  height: 56px;
  justify-content: center;
  left: 0;
  padding: 0 10px;
  position: fixed;
  width: 100%;
  z-index: 50;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    display: none;
  }
`

const Item = styled(NavLink)`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  row-gap: 8px;
  text-decoration: none;
  transition: opacity 0.15s linear;
  user-select: none;

  &:active {
    opacity: 0.5;
  }

  .fill {
    fill: ${({ theme }) => theme.mobileMenu.itemColor};
  }

  &.active {
    pointer-events: none;

    .fill {
      fill: ${({ theme: { colors } }) => colors.primary};
    }
  }
`

const Icon = styled.span`
  align-items: center;
  display: flex;
  height: 15px;
  justify-content: center;
`

const Text = styled.span`
  color: ${({ theme }) => theme.mobileMenu.itemColor};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.2;
  padding: 0 12px;
  text-decoration: none;
  white-space: nowrap;

  .active & {
    color: ${({ theme: { colors } }) => colors.primary};
  }
`

export const MobileMenu: React.FC = ({ ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      {sections.map(({ href, icon, title }, index) => (
        <Item href={href} key={`mobile_menu_item_${index}`}>
          <Icon>{icon}</Icon>
          <Text>{title}</Text>
        </Item>
      ))}
    </Wrapper>
  )
}
