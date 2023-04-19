import Link from 'next/link'
import { lighten } from 'polished'
import React from 'react'
import styled from 'styled-components'

import { Badge } from '@/src/components/pureStyledComponents/common/Badge'

const Wrapper = styled.div`
  align-items: center;
  background-color: ${({ theme: { myPool } }) => myPool.backgroundColor};
  border-radius: 8px;
  border: 1px solid ${({ theme: { myPool } }) => myPool.borderColor};
  color: ${({ theme: { myPool } }) => myPool.color};
  display: flex;
  font-size: 0.9rem;
  font-weight: 500;
  gap: 14px;
  height: 36px;
  overflow: hidden;
  padding: 0 20px;
  text-decoration: none;
  transition: background-color 0.1s linear;

  &:hover {
    background-color: ${({ theme }) => lighten(0.1, theme.myPool.backgroundColor)};
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

  background-color: ${({ stage, theme: { stages } }) => stages[stage] ?? '#fff'};
  border: 1px solid
    ${({ stage, theme: { stages } }) =>
      stage === 'complete' ? 'rgba(71, 87, 97, 0.5)' : stages[stage]};
  border-radius: 5px;
  display: block;
  height: var(--dimensions);
  width: var(--dimensions);
`

export const StyledLink = styled(Link)`
  text-decoration: none;
`

interface Props {
  href: string
  notifications?: number
  stage: StageTypes
}

export const Pool: React.FC<Props> = ({ children, href, notifications, stage, ...restProps }) => {
  return (
    <StyledLink href={href} passHref>
      <Wrapper {...restProps}>
        <State stage={stage.toLowerCase()} />
        {children}
        {notifications !== 0 && <Badge>{notifications}</Badge>}
      </Wrapper>
    </StyledLink>
  )
}

export default Pool
