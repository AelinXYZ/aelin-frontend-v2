import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'

import { Notifications as NotificationsIcon } from '@/src/components/assets/Notifications'

const Wrapper = styled.a`
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
`

const Badge = styled.div`
  align-items: center;
  background: ${({ theme: { colors } }) => colors.primary};
  border-radius: 50%;
  color: ${({ theme: { colors } }) => colors.textColor};
  display: flex;
  font-size: 0.8rem;
  font-weight: 600;
  height: 12px;
  justify-content: center;
  line-height: 1;
  position: absolute;
  right: -4px;
  top: 2px;
  width: 12px;
  z-index: 5;
`

export const Notifications: React.FC = ({ ...restProps }) => {
  const notifications = 8

  return (
    <Link href="/notifications" passHref>
      <Wrapper {...restProps}>
        <NotificationsIcon />
        <Badge>{notifications}</Badge>
      </Wrapper>
    </Link>
  )
}
