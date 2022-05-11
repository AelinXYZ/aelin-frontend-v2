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

type StageTypes =
  | 'poolopen'
  | 'open'
  | 'fundingdeal'
  | 'seekingdeal'
  | 'dealopen'
  | 'dealready'
  | 'vesting'
  | 'complete'
  | string

const State = styled.span<{ stage: StageTypes }>`
  --dimensions: 8px;

  border-radius: 5px;
  display: block;
  height: var(--dimensions);
  width: var(--dimensions);

  background-color: ${({ stage, theme: { stages } }) => stages[stage] ?? '#fff'};
`

interface Props {
  stage: StageTypes
  href: string
  notifications?: number
}

const Pool: React.FC<Props> = ({ children, href, notifications, stage, ...restProps }) => {
  return (
    <Link href={href} passHref>
      <Wrapper {...restProps}>
        <State stage={stage} />
        {children}
        {notifications !== 0 && <Badge>{notifications}</Badge>}
      </Wrapper>
    </Link>
  )
}

export default Pool
