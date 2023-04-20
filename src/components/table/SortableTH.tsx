import { ReactNode } from 'react'
import styled from 'styled-components'

import { Sort as BaseSort } from '@/src/components/assets/Sort'
import { TH } from '@/src/components/pureStyledComponents/common/Table'

const Wrapper = styled(TH)<{ onClick?: () => void }>`
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  gap: 10px;
  user-select: none;

  &:active {
    opacity: 0.7;
  }
`

const Text = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem;
`

const Sort = styled(BaseSort)<{ isActive?: boolean }>`
  flex-shrink: 0;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.2)};
`

type SortableTHProps = {
  children: ReactNode
  isActive?: boolean
  justifyContent?: string
  onClick?: () => void
}

export const SortableTH = ({ children, isActive, onClick }: SortableTHProps) => {
  return (
    <Wrapper onClick={onClick}>
      <Text>{children}</Text>
      {onClick && <Sort isActive={isActive} />}
    </Wrapper>
  )
}
