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

const Badge = styled.div``

export const Notifications: React.FC<{ name: string }> = ({ name, ...restProps }) => (
  <Link href="/notifications" passHref>
    <Wrapper {...restProps}>
      <NotificationsIcon />
      <Badge>{name}</Badge>
    </Wrapper>
  </Link>
)
