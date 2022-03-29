import React from 'react'
import styled from 'styled-components'

const Invest = styled.a`
  align-items: center;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: ${({ theme: { colors } }) => colors.textColor};
  display: flex;
  height: 36px;
  margin-bottom: 10px;
`

const State = styled.span`
  --dimensions: 8px;

  border-radius: 5px;
  display: block;
  height: var(--dimensions);
  margin: 0 8px 0 14px;
  width: var(--dimensions);

  ${({ color, theme }) => color && `background-color: ${theme.states[color]};`}
`

interface Props {
  color: 'green' | 'yellow' | 'blue'
  notifications?: number
}

const Pool: React.FC<Props> = ({ children, color, notifications }) => {
  return (
    <Invest>
      <State color={color} /> {children}
      {/* <Badge> {notifications} </Badge> */}
    </Invest>
  )
}

export default Pool
