import Link from 'next/link'
import { lighten } from 'polished'
import React from 'react'
import styled from 'styled-components'

import { Badge } from '@/src/components/pureStyledComponents/common/Badge'

const Wrapper = styled.a`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.gray};
  border-radius: 8px;
  color: ${({ theme: { colors } }) => colors.textColor};
  display: flex;
  font-size: 1.4rem;
  font-weight: 500;
  gap: 14px;
  height: 36px;
  margin-bottom: 10px;
  overflow: hidden;
  padding: 0 20px;
  text-decoration: none;
  text-overflow: ellipsis;
  transition: background-color 0.1s linear;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => lighten(0.1, theme.colors.gray)};
  }

  &:active {
    opacity: 0.7;
  }
`

const State = styled.span`
  --dimensions: 8px;

  border-radius: 5px;
  display: block;
  height: var(--dimensions);
  width: var(--dimensions);

  ${({ color, theme }) => color && `background-color: ${theme.states[color]};`}
`

interface Props {
  color: 'green' | 'yellow' | 'blue' | string
  href: string
  notifications?: number
}

const Pool: React.FC<Props> = ({ children, color, href, notifications, ...restProps }) => {
  return (
    <Link href={href} passHref>
      <Wrapper {...restProps}>
        <State color={color} />
        {children}
        {notifications && <Badge>{notifications}</Badge>}
      </Wrapper>
    </Link>
  )
}

export default Pool
