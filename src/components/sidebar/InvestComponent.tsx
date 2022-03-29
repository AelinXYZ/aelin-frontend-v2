import React, { useState } from 'react'
import styled from 'styled-components'

import CollapseComponents from './CollapseComponents'
import { RoundedButton } from '@/src/components/pureStyledComponents/buttons/Button'

const MyPoolsItems = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  & a {
    font-size: 1rem;
  }
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    margin-top: 15px;
  }
`

const Invest = styled.a`
  display: flex;
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  background-color: rgba(255, 255, 255, 0.08);
  margin-bottom: 10px;
  border-radius: 8px;
  height: 36px;
`

const Notifications = styled.span`
  display: inline-block;
  background-color: #3cbff0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
`

const Color = styled.span`
  ${({ color, theme }) =>
    color &&
    `
   background-color:  ${theme.colors[color]};
  `}
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 5px;
  margin: 0 8px 0 14px;
`

const RoundButton = styled(RoundedButton)`
  margin: 12px auto 20px;
`

const Button = styled(RoundButton)`
  font-size: 1rem;
  height: 24px;
  padding: 0 10px 0 10px;
  opacity: 0.7;
  margin: 0;
  transition: 0.7s;
  &.active {
    background-color: ${({ theme }) => theme.buttonPrimary.backgroundColor};
    border-color: ${({ theme }) => theme.buttonPrimary.borderColor};
    color: ${({ theme }) => theme.buttonPrimary.color};
  }
`
interface Props {
  label: string
  notif?: number
  color?: 'poolGreenState' | 'poolYellowState' | 'poolBlueState'
}

const MyPoolsFunc: React.FC<Props> = ({ color, label, notif }) => {
  return (
    <Invest>
      <Color color={color} /> {label}
      {/* TODO: notifications<Notifications > { notif } </Notifications> */}
    </Invest>
  )
}

export default MyPoolsFunc
