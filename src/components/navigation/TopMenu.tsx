import styled from 'styled-components'

import { NavLink } from '@/src/components/navigation/NavLink'
import { ButtonCSS } from '@/src/components/pureStyledComponents/buttons/Button'
import { sections } from '@/src/constants/sections'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 10px;
`

const Item = styled(NavLink)`
  ${ButtonCSS}
  border-color: transparent;
  color: ${({ theme: { colors } }) => colors.textColor};
  padding: 0 12px;

  &.active,
  &:hover {
    background-color: ${({ theme }) => theme.buttonPrimary.backgroundColor};
    border-color: ${({ theme }) => theme.buttonPrimary.borderColor};
    color: ${({ theme }) => theme.buttonPrimary.color};

    .fill {
      fill: ${({ theme }) => theme.buttonPrimary.borderColor};
    }
  }
`

export const TopMenu: React.FC = ({ ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      {sections.map(({ href, icon, title }, index) => (
        <Item href={href} key={`top_menu_item_${index}`}>
          {icon} {title}
        </Item>
      ))}
    </Wrapper>
  )
}
